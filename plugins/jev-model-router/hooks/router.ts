import type { EngineInterface, PluginOptions, Register, TurnStepInput } from "claude-code";

import { FALLBACK_MODEL_IDS, MODELS, MODELS_URL, pickModelIds, type Model, type ModelIds } from "./models.ts";

// Routing strategy: `prompt.submit` asks TypeSafe which model and effort the
// prompt needs, then `turn.step` (every model request, main loop and subagents)
// and `agent.spawn` (every new subagent) apply that decision until the next prompt.

const EFFORTS = ["low", "medium", "high", "xhigh", "max"] as const;

type Effort = (typeof EFFORTS)[number];

type TurnStepEffort = TurnStepInput["effort"];

// Loops remembered by `turn.step`; the oldest is forgotten past this.
const MAX_SETTLED = 64;

interface Decision {
  model: Model;
  effort: Effort;
}

const TYPESAFE_URL = "https://api.typesafe.ai/v1/systemone";

// Hooks get a 10 s budget; a slower TypeSafe answer leaves the prompt unrouted.
const QUESTIONS = {
  model: {
    type: "choice",
    instructions: "What anthropic model I must use given the complexity of the prompt?",
    criteria: Object.fromEntries(MODELS.map((m) => [m, null])),
  },
  effort: {
    type: "choice",
    instructions: "What effort level I must use for the selected model?",
    criteria: Object.fromEntries(EFFORTS.map((e) => [e, null])),
  },
};

function isModel(value: unknown): value is Model {
  return MODELS.includes(value as Model);
}

function isEffort(value: unknown): value is Effort {
  return EFFORTS.includes(value as Effort);
}

// Prefers the plugin's `typesafeApiKey` userConfig, then TYPESAFE_API_KEY.
async function apiKey($: EngineInterface, options: PluginOptions): Promise<string | undefined> {
  const pluginKey = typeof options.typesafeApiKey === "string" ? options.typesafeApiKey.trim() : "";
  if (pluginKey) {
    return pluginKey;
  }
  return (await $.env.get("TYPESAFE_API_KEY"))?.trim() || undefined;
}

// Warns the user and routes nothing, so a bad key never breaks the session.
function skipRouting($: EngineInterface, reason: string): undefined {
  $.ui.log(`Model router skipped: ${reason}`);
  return undefined;
}

// The newest id in each family that the session's own credential can use. Never
// rejects: without a first-party credential (a third-party provider, a gateway) or
// a models list, it falls back to the built-in table.
async function loadModelIds($: EngineInterface): Promise<ModelIds> {
  try {
    const auth = await $.session.authorize();
    if (!auth) {
      $.ui.log("Model router: no Anthropic credential to list models with; using built-in model ids.");
      return FALLBACK_MODEL_IDS;
    }
    const response = await $.http.fetch(MODELS_URL, {
      headers: {
        "anthropic-version": "2023-06-01",
        // The API takes a claude.ai login's token only under this beta.
        ...(auth.kind === "bearer" && { "anthropic-beta": "oauth-2025-04-20" }),
      },
      auth: auth.handle,
    });
    if (!response.ok) {
      throw new Error(`the models list answered ${response.status}`);
    }
    return pickModelIds(response.text);
  } catch (error) {
    $.ui.log(`Model router: could not list models (${(error as Error).message}); using built-in model ids.`);
    return FALLBACK_MODEL_IDS;
  }
}

async function decide($: EngineInterface, options: PluginOptions, prompt: string): Promise<Decision | undefined> {
  const key = await apiKey($, options);
  if (!key) {
    return skipRouting($, "no API key; set the plugin's TypeSafe API key or TYPESAFE_API_KEY.");
  }
  const response = await $.http.fetch(TYPESAFE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "jev-latest", state: { document: prompt }, questions: QUESTIONS }),
  });
  if (response.status === 401 || response.status === 403) {
    return skipRouting($, `the TypeSafe API key was rejected (${response.status}).`);
  }
  if (!response.ok) {
    return skipRouting($, `TypeSafe answered ${response.status}.`);
  }
  const answers = JSON.parse(response.text)?.answers;
  const model = answers?.model?.choice;
  const effort = answers?.effort?.choice;
  if (!isModel(model) || !isEffort(effort)) {
    return skipRouting($, "TypeSafe returned an unexpected answer.");
  }
  return { model, effort };
}

export const register: Register = (on, options) => {
  const showDecisions = options.showDecisions !== false;

  // The decision for the prompt being worked on; undefined leaves Claude Code's own choice.
  let decision: Decision | undefined;

  // Listed once at session start, in the background so startup isn't held up.
  let modelIds = FALLBACK_MODEL_IDS;
  let modelIdsLoad: Promise<void> | undefined;

  on("session.start", async ($, e, next) => {
    modelIdsLoad = loadModelIds($).then((ids) => {
      modelIds = ids;
      const listed = MODELS.map((m) => `${m}: ${ids[m]}`).join(", ");
      $.ui.log(`Model router: models ${listed}`);
    });
    return next(e);
  });

  on("prompt.submit", async ($, e, next) => {
    try {
      decision = await decide($, options, e.text);
    } catch (error) {
      decision = skipRouting($, `could not reach TypeSafe: ${(error as Error).message}`);
    }
    await modelIdsLoad;
    if (decision && showDecisions) {
      $.ui.log(`Model router: ${decision.model}, effort ${decision.effort}`);
    }
    return next(e);
  });

  // What each running loop settled on at its first request, keyed by turn and agent.
  // A prompt submitted mid-turn replaces `decision`, but the loop it lands in keeps
  // its model and effort until the loop ends.
  const settled = new Map<string, { model: string; effort?: TurnStepEffort }>();

  on("turn.step", async function* ($, e, next) {
    const key = `${e.turnId}/${e.agentId ?? "main"}`;
    let pinned = settled.get(key);
    if (!pinned) {
      // An unrouted first request pins what the engine chose, so the loop stays unrouted.
      pinned = decision
        ? { model: modelIds[decision.model], effort: decision.effort }
        : { model: e.model, effort: e.effort };
      settled.set(key, pinned);
      if (settled.size > MAX_SETTLED) {
        settled.delete(settled.keys().next().value!);
      }
    }
    return yield* next({ ...e, model: pinned.model, ...(pinned.effort !== undefined && { effort: pinned.effort }) });
  });

  on("agent.spawn", async ($, e, next) => {
    // Forks always inherit the parent's model, so there is nothing to route.
    if (!decision || e.fork) {
      return next(e);
    }
    if (showDecisions) {
      $.ui.notice(e.tool_use_id, `Model router: ${decision.model}`);
    }
    return next({ ...e, model: modelIds[decision.model] });
  });
};

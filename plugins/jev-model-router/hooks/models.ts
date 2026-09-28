export const MODELS = ["fable", "opus", "sonnet", "haiku"] as const;

export type Model = (typeof MODELS)[number];

export type ModelIds = Record<Model, string>;

// `turn.step` sends its model to the API as given, so it needs a full id, not an alias.
// Used for any family the models list can't fill in.
export const FALLBACK_MODEL_IDS: ModelIds = {
  fable: "claude-fable-5-1",
  opus: "claude-opus-5-5",
  sonnet: "claude-sonnet-5",
  haiku: "claude-haiku-4-5-20251001",
};

export const MODELS_URL = "https://api.anthropic.com/v1/models?limit=1000";

// The newest id in each family from a `GET /v1/models` body, over the fallback.
export function pickModelIds(body: string): ModelIds {
  const data: unknown = JSON.parse(body)?.data;
  const ids = (Array.isArray(data) ? data : [])
    .map((m) => m?.id)
    .filter((id): id is string => typeof id === "string");
  // The list is newest first, so the first match is the family's latest.
  const found = { ...FALLBACK_MODEL_IDS };
  for (const model of MODELS) {
    const id = ids.find((id) => id.startsWith(`claude-${model}-`));
    if (id) {
      found[model] = id;
    }
  }
  return found;
}

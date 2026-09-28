# jev-model-router

A Claude Code plugin for routing tasks to the right model.

On every prompt it asks TypeSafe which model (fable, opus, sonnet, haiku) and effort level the prompt needs, then runs the turn, and any subagents it spawns, on that choice.

## How it works

The plugin is a Claude Code **hooks module** (`hooks/router.ts`), an early-access feature:

- `session.start` lists the models your credential can use.
- `prompt.submit` asks TypeSafe for a model and effort for the prompt.
- `turn.step` rewrites every model request (main loop and subagents) to that model and effort.
- `agent.spawn` starts every new subagent on that model.

At session start it also lists the models your Anthropic credential can use (`GET /v1/models`, sent with Claude Code's own credential, which the plugin never sees) and routes to the newest id in each family. Without a first-party credential, or if the list can't be fetched, it uses the built-in ids in `hooks/models.ts`.

The decision holds until the next prompt. If TypeSafe can't be reached or the key is missing, the plugin logs a line in the transcript and leaves Claude Code's own model in place.

## Requirements

Hooks modules are early access. Claude Code only loads them for installed plugins when this is set in its environment:

```sh
export CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1
```

## Install

Install it from this repo's marketplace (see the [root README](../../README.md)):

```
/plugin install jev-model-router@jmanuelc87-plugins
```

## Configuration

Set in `/config` once the plugin is enabled:

- **TypeSafe API key** (`typesafeApiKey`): falls back to `TYPESAFE_API_KEY` when empty.
- **Show routing decisions** (`showDecisions`, default on): logs each decision as a line in the transcript.

## Layout

```
.claude-plugin/
  plugin.json        # plugin manifest and userConfig
hooks/
  hooks.json         # names the hooks module
  router.ts          # the hooks module (loaded as-is, no build step)
  models.ts          # the model families, their fallback ids, and the models-list parser
```

## Development

Run these from the repo root:

```sh
# write the 'claude-code' type declarations to .claude/types (tsconfig.json reads them)
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude -p "/plugin-types .claude/types"

# what the module hooks and calls, and anything the engine would refuse
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude plugin validate plugins/jev-model-router
```

Load the plugin directly for one session:

```sh
CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1 claude --plugin-dir plugins/jev-model-router
```

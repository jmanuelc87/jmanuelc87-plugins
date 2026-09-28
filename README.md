# jmanuelc87-plugins

A Claude Code plugin marketplace by jmanuelc87.

## Plugins

| Plugin | Description |
| --- | --- |
| [jev-model-router](plugins/jev-model-router) | Routes each prompt to the right model and effort level. |

## Install

Add this repo as a marketplace, then install a plugin from it:

```
/plugin marketplace add ./
/plugin install jev-model-router@jmanuelc87-plugins
```

Once the repo is on GitHub, others can add it with `/plugin marketplace add <owner>/<repo>`.

## Layout

```
.claude-plugin/
  marketplace.json     # lists every plugin under plugins/
plugins/
  <plugin-name>/
    .claude-plugin/
      plugin.json      # the plugin's manifest
    hooks/ ...         # the plugin's components
    README.md
tsconfig.json          # type-checks every plugin's hooks against .claude/types
```

To add a plugin, create `plugins/<name>/` with its own `.claude-plugin/plugin.json`, then add an entry to `.claude-plugin/marketplace.json` with `"source": "./plugins/<name>"`.

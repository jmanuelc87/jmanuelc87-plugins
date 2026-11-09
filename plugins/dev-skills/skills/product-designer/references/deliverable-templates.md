# Deliverable Templates

Use these when the user wants a thorough, document-style deliverable — a spec they can hand to a team — rather than a conversational answer. For quick questions, the condensed templates in SKILL.md are plenty. Don't pad a small request into a big document; match the format to the ask.

---

## Information Architecture map

Use when the question is about *how the product is organized* — navigation, grouping, hierarchy.

```
# IA: [Product / area name]

## Users & their primary jobs
- [User type] → [the main things they come here to do]

## Top-level structure
- [Section 1] — what lives here, who it's for
  - [Sub-area] — ...
- [Section 2] — ...

## Navigation model
How users move between sections (tabs / sidebar / hierarchy / search-first),
and why this model fits the usage pattern.

## Naming
The label for each section in the user's vocabulary, with a note on any term
that tested ambiguous or that you're unsure about.

## Open questions
Groupings or labels that need validation with real users.
```

Heuristics: minimize depth (every extra level is a place to get lost); group by the user's mental model, not the org chart or the database; make "where am I" and "how do I get back" answerable at all times; resist the urge to expose internal structure just because it exists.

---

## Full screen specification

```
# Screen: [Name]

## Purpose
One sentence: what this screen exists to let the user do.

## Context
- Entry points: how users arrive here
- User state on arrival: what they know / have done already
- Device & context: where and how this is used

## Primary action
The single most important action. This gets the most visual weight.

## Layout & hierarchy
Top-to-bottom (or zone-by-zone) description. Be explicit about what's most
prominent and why. Note above-the-fold priorities for the smallest target screen.

## Elements
For each meaningful element:
- Label / copy: the actual words
- Behavior: what it does, what happens on interaction
- Priority: primary / secondary / tertiary

## States
Walk the catalog (see ui-states.md). For each that applies, give the copy and
the recovery path:
- Empty: ...
- Loading: ...
- Error: ...
- Success: ...
- (offline / no-permission / edge cases as relevant)

## Accessibility notes
The specific requirements that apply (see accessibility.md): contrast intent,
focus order, labels, touch targets, anything non-obvious.

## Exits
Where the user can go from here.

## Rationale
The non-obvious decisions, each as: decision → alternative rejected → why.
```

---

## Flow specification

```
# Flow: [Name]

## Goal
The outcome the user achieves by completing this.

## Success metric
How we'd know this flow is working.

## Trigger & entry
What starts the flow and where the user enters.

## Steps
1. [Screen/step] — user does X → system responds Y
2. ...
(Each step names the screen, the user's action, and the system's response.)

## Decision points
- At [step], if [condition] → [path A]; else → [path B]

## Failure & recovery
For each step that can fail: what fails, what the user sees, how they recover.
Never leave a dead end.

## Success state
The end state and how completion is confirmed to the user.

## Drop-off risks
Where users are most likely to abandon, and what reduces that.
```

---

## Design rationale document

Use when the user needs to defend or align a team around design decisions.

```
# Design rationale: [Feature / flow]

## Problem
The underlying user need (as an outcome, not a feature). Who, what job, in what context.

## Goals & non-goals
What this design is trying to achieve — and explicitly what it is NOT trying to solve.

## Approach
The chosen direction, in a few sentences.

## Key decisions
For each significant decision:
- Decision: what we chose
- Alternatives considered: what else was on the table
- Why: the reasoning, including the tradeoff accepted
- Confidence: high / medium / needs validation

## Constraints
Engineering, platform, timeline, or business constraints that shaped this.

## Risks & open questions
What we're unsure about and how we'd validate it (usability test, A/B, analytics).

## What we'd do with more time/resources
The one or two investments that would most improve the experience — so the team
can decide deliberately rather than by default.
```

---

## Choosing the right one

- Question about organization/navigation → **IA map**
- "Spec this screen" → **screen spec**
- "Design this journey" / multi-screen → **flow spec** (+ screen specs for the key screens)
- "Help me justify / align the team on this" → **rationale doc**
- A quick targeted question → none of these; just answer well using the principles in SKILL.md.

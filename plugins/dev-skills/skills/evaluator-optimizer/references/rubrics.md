# Starter rubrics

Adapt these — don't paste them as-is. Criteria that don't reflect what the user actually cares about produce a loop that optimizes the wrong thing, competently.

Each criterion is tagged `[B]` blocking or `[A]` advisory. The split is the loop's termination condition, so if you change nothing else, get this right for the task at hand. A rubric where everything is blocking never converges; one where nothing is blocking converges instantly and meaninglessly.

**Contents:** [Code](#code) · [Written deliverables](#written-deliverables) · [Prompts](#prompts) · [Analysis](#analysis-and-research) · [Design docs](#design-and-architecture-docs) · [Writing your own](#writing-your-own)

---

## Code

| id | criterion | |
|---|---|---|
| `correct` | Does what was asked, including the edge cases named in the request | [B] |
| `errors` | Failure paths handled; no silent swallowing of exceptions | [B] |
| `security` | No injection-prone string building, no secrets in source, inputs validated at trust boundaries | [B] |
| `tests` | Behavior covered by tests, including at least one failure case | [B] |
| `readable` | Names say what things are; control flow is followable without reverse-engineering | [A] |
| `scoped` | No functionality beyond what was requested | [A] |
| `consistent` | Matches the conventions of surrounding code | [A] |

Add `performance` as blocking only when a concrete target exists. Without a number it becomes an invitation to premature optimization.

## Written deliverables

Reports, memos, client-facing documents.

| id | criterion | |
|---|---|---|
| `answers` | Answers the question that was asked, in the first paragraph | [B] |
| `sourced` | Every quantitative claim traceable to a named source | [B] |
| `audience` | Readable by the stated audience without unexplained jargon | [B] |
| `accurate` | No claim beyond what the underlying evidence supports | [B] |
| `structure` | Sections in an order that serves the reader, not the author's process | [A] |
| `tight` | No paragraph that could be cut without losing meaning | [A] |
| `actionable` | Recommendations name an owner or a next step | [A] |

For client deliverables, promote `sourced` and `accurate` above everything else — an unsourced figure in a client document costs more than every stylistic flaw combined.

## Prompts

For iterating on prompts and prompt pipelines.

| id | criterion | |
|---|---|---|
| `unambiguous` | Only one reasonable reading of the instruction | [B] |
| `output-spec` | Output format specified precisely enough to parse or validate | [B] |
| `grounded` | Model is told what to do when the input doesn't support an answer | [B] |
| `edge-cases` | Empty, malformed, and out-of-scope inputs have defined behavior | [B] |
| `examples` | Examples cover the boundary, not just the happy path | [A] |
| `no-conflict` | No instruction contradicts another | [B] |
| `lean` | No instruction that doesn't change behavior | [A] |

Test rather than trust: run the prompt on a hard input and evaluate the *output*, not the prompt text. A prompt that reads well and behaves badly is the normal case.

## Analysis and research

| id | criterion | |
|---|---|---|
| `question` | Addresses the question posed, not an adjacent easier one | [B] |
| `evidence` | Each conclusion traceable to specific evidence | [B] |
| `contrary` | Evidence cutting against the conclusion is engaged, not omitted | [B] |
| `limits` | States what the analysis cannot determine | [B] |
| `method` | Method described well enough to reproduce | [A] |
| `calibrated` | Confidence language matches strength of evidence | [A] |

`contrary` is the one that matters most and gets dropped most often. An analysis that only marshals supporting evidence is advocacy, and a fresh evaluator will usually catch it where the author can't.

## Design and architecture docs

| id | criterion | |
|---|---|---|
| `problem` | States the problem before the solution | [B] |
| `tradeoffs` | Alternatives considered, with why they lost | [B] |
| `constraints` | Real constraints stated — scale, budget, team, existing systems | [B] |
| `failure` | Failure modes and their handling addressed | [B] |
| `boundaries` | Component responsibilities and interfaces defined | [A] |
| `buildable` | Enough detail for someone else to implement | [A] |

---

## Writing your own

Convert vague quality wishes into checkable statements. The test is whether a stranger holding only the artifact and the criterion can decide pass/fail without asking what you meant.

| vague | checkable |
|---|---|
| "professional tone" | "no contractions; no exclamation marks; no second person" |
| "well organized" | "each section's first sentence states what the section establishes" |
| "robust" | "every external call has a timeout and a defined failure behavior" |
| "concise" | "under 800 words; no sentence restating a previous sentence" |
| "good examples" | "at least one example per edge case named in the requirements" |

Six to ten criteria is the working range. Fewer and the loop misses things; more and the evaluator spreads thin and returns shallow findings on all of them.

Keep criteria fixed across iterations. Adding criteria mid-loop because the evaluator surfaced something new means you're no longer measuring improvement — you're moving the target, and the log stops being interpretable. Note the new criterion, finish the loop, then decide with the user whether to run again against the expanded set.

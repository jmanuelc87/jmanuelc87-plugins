---
name: evaluator-optimizer
description: >-
  Run an evaluator-optimizer loop — generate a candidate, critique it against
  explicit criteria in a fresh evaluation context, revise, and repeat until it
  converges or hits a cap. Use this whenever output quality matters more than
  latency and there are criteria you can actually name — refining prompts,
  hardening a spec or design doc, tightening prose, improving code against
  review standards, or iterating on any deliverable a client will scrutinize.
  Trigger it when the user says things like "make this better", "iterate on
  this until it's good", "review and revise", "polish this", "critique your own
  output", "keep improving until X", or asks for a self-correcting or
  multi-pass workflow — even if they never say "evaluator-optimizer" or
  "reflection loop". Also use it when a first draft exists and the user is
  dissatisfied but hasn't said precisely why.
---

# Evaluator-Optimizer

A loop where one pass produces a candidate and a separate pass judges it against named criteria, feeding specific, actionable deltas back into the next attempt. It repeats until the candidate clears the bar or the loop runs out of budget.

The value comes from separation. If the same context that wrote the draft also grades it, it grades its own reasoning rather than the artifact, and it tends to rubber-stamp. Almost everything below exists to preserve that separation and to keep the feedback specific enough to act on.

## When this pattern earns its cost

It works when both of these hold:

- **Criteria can be named.** Not necessarily measured numerically, but articulable: "cites a source for every quantitative claim", "no function longer than 40 lines", "a non-technical reader can follow it". If you can't name what "better" means, the loop will wander.
- **Revision genuinely helps.** The task has a quality ceiling above what one pass reaches — writing, design, analysis, code review, prompt engineering.

It's the wrong tool when the task is lookup, retrieval, or arithmetic (one pass is either right or wrong, and iterating just burns tokens), when the criteria are pure taste with no articulable standard, or when the user wants speed over polish. Say so plainly rather than running the loop anyway.

## Before iterating: fix the criteria

Do this first and do it explicitly, because a loop with vague criteria produces drift, not improvement. Write the criteria down where both roles can see them.

Ask the user for criteria if they haven't given any. If they can't articulate them, propose a set and get confirmation before spending iterations. Each criterion should be:

- **Checkable** — someone reading only the output and the criterion can decide pass/fail without guessing.
- **Independent** — overlapping criteria cause the evaluator to double-count the same flaw.
- **Prioritized** — mark each one `blocking` or `advisory`. Blocking criteria must pass to converge; advisory ones inform revision but don't hold up the loop. Without this distinction the loop never terminates, because there's always one more nit.

`references/rubrics.md` has starter criteria for common domains — code, written deliverables, prompts, analysis. Read it when the task fits one of those and adapt rather than inventing from scratch.

## The loop

### 1. Generate

Produce the first candidate normally. Don't pre-critique it or hedge — a defensively-written first draft gives the evaluator less to work with. If a draft already exists (the user brought one), skip straight to evaluation.

### 2. Evaluate — in a fresh context

Spawn a subagent for evaluation. Give it the candidate and the criteria, and nothing else: not the original request's back-and-forth, not the reasoning behind design choices, not previous evaluations. It should react to the artifact the way a reviewer who just received it would.

Use the template in `references/evaluator-prompt.md`. It returns a structured verdict — per-criterion pass/fail plus specific located deltas.

If subagents aren't available in the current environment, fall back to in-context evaluation, but tell the user the critique is weaker for it, and compensate by forcing the evaluator role to quote the specific text or line it's objecting to before proposing a fix. Quoting anchors the critique to the artifact rather than to remembered intent.

**The evaluator's output must be actionable.** A score with no located defect is useless to the optimizer. Every failing criterion needs: where the problem is, what's wrong, and what would satisfy the criterion. If the evaluator returns "clarity: 6/10" and nothing else, send it back.

The evaluator should also be allowed to say the candidate passes. Evaluators told to find problems will invent them, which produces churn that looks like progress. Frame the task as judging, not as fault-finding.

### 3. Optimize

Address the blocking deltas. Advisory ones are judgment calls — take the ones that don't conflict with blocking fixes.

Two things to watch here:

- **Don't rewrite wholesale.** Wholesale rewrites lose the parts that already passed and reintroduce defects fixed two iterations ago. Apply targeted edits.
- **You may reject a delta.** If the evaluator misread something or the fix would violate a constraint it didn't know about, record the disagreement in the log with the reason instead of silently complying. Unexamined compliance with a wrong critique is how these loops degrade output.

### 4. Check for convergence, then repeat

Stop when any of these hit:

- **Converged** — all blocking criteria pass.
- **Budget exhausted** — the iteration cap is reached. Default to 3; go up to 5 for high-stakes deliverables. Beyond that, returns are near zero and the loop is usually thrashing.
- **Plateau** — two consecutive iterations produce no change in which criteria pass. More iterations won't help; the problem is the criteria or the approach, not the effort.
- **Regression** — the new candidate fails a criterion the previous one passed. Revert to the last good version, note what caused it, and try a narrower fix.

On stopping, report to the user: which version won, which criteria passed and failed, and — if it stopped short of convergence — what specifically is still unmet and why iterating further wouldn't fix it. Don't present a non-converged result as finished.

## Keep a log

Maintain an iteration log across the loop. It prevents the most common failure, which is cycling between two flawed versions because nobody remembers that version 2 already tried this.

```markdown
## Iteration N
**Candidate:** <path or summary>
**Verdict:** converged | failing: [criterion ids]
**Deltas applied:** <what changed and why>
**Deltas rejected:** <what was declined and the reasoning>
**Delta vs. previous:** <which criteria flipped, in which direction>
```

Give the optimizer the log — it needs history. Never give the log to the evaluator; history is exactly what contaminates a fresh evaluation.

## Variants worth knowing

**Lightweight (single context).** Skip the subagent, do generate → critique → revise inline. Cheaper and faster, meaningfully weaker critique. Fine for low-stakes polish; not for anything where an outside reader's reaction is the actual test.

**Tournament.** Generate 3 candidates by different approaches, evaluate all against the same criteria, then optimize only the winner. Costs more upfront but escapes the local optimum a single seed can trap you in. Reach for it when the first draft feels structurally wrong rather than merely rough.

**Metric-backed.** When a programmatic check exists — a test suite, a linter, a scoring function, an existing eval harness — run it and give the evaluator its output alongside the criteria. Hard signal beats judgment where hard signal is available; reserve the LLM evaluator for what can't be measured. Wire in the user's existing harness rather than inventing a parallel one.

**Human-in-the-loop.** Surface the evaluator's verdict to the user before optimizing, and let them override, add, or drop deltas. Slower, but the right default when the criteria are contested or the deliverable is client-facing.

## Failure modes

- **Rubber-stamping** — evaluator approves everything. Usually caused by context leakage; check that it's genuinely fresh, and that criteria are checkable rather than vague.
- **Nitpick churn** — evaluator always finds something, loop never ends. Fix by enforcing the blocking/advisory split and honoring it.
- **Criteria drift** — evaluator judges against standards nobody wrote down. Pass the criteria list verbatim each round; don't paraphrase it.
- **Sycophantic optimizer** — every delta accepted uncritically, including wrong ones. The rejection path in step 3 exists for this; use it.
- **Cost blowout** — each iteration is a full generate plus a full evaluate. Set the cap before starting, and tell the user the cap.

## References

- `references/rubrics.md` — starter criteria by domain (code, written deliverables, prompts, analysis). Read when the task fits one.
- `references/evaluator-prompt.md` — the subagent template and the structured verdict format. Read before the first evaluation pass.

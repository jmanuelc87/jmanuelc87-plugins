---
name: solution-brainstorm
description: Facilitate structured brainstorming for product and technical solution design — first diverging to put a genuinely varied set of approaches on the table, then converging to weigh trade-offs against the user's real constraints and recommend a path. Use this whenever the user is exploring how to build, architect, or approach an open-ended technical or product problem and would benefit from seeing the option space before committing, e.g. "how should I approach X", "what are my options for Y", "help me think through the design of Z", "brainstorm ways to…", "I'm stuck on how to…", "should we build or buy", "what architecture makes sense for…", or when they present a design question and seem to want more than a single canned answer. Trigger it even when the user never says the word "brainstorm" — if the question is genuinely open-ended and has multiple defensible solutions, use this skill rather than firing off the first idea that comes to mind.
---

# Solution Brainstorm

This skill is for thinking through open-ended product and technical design problems *with* someone — the kind of question where there's no single right answer, several approaches could work, and the hard part is seeing the full space and then choosing well.

The core move is **diverge, then converge**. Most brainstorms fail in one of two ways: they collapse instantly onto the first plausible idea (no divergence), or they produce a pile of options and leave the person to sort it out (no convergence). Do both, in that order, and the session becomes genuinely useful.

One thing to hold onto throughout: the person almost always knows their own context — their stack, their team, their politics, their deadline — better than you do. Your job is to widen their view and sharpen the trade-offs, not to hand down a verdict. Recommend, explain your reasoning, and leave them the decision.

## The shape of a session

Three phases: **frame → diverge → converge**. Treat this as a rhythm, not a rigid script. If the person clearly just wants ideas thrown at them, spend one line framing and get to it. If they're deep in analysis paralysis, the framing and convergence matter more than volume. Read the situation.

### Phase 1 — Frame the problem

Technical brainstorms go wrong most often not because the ideas were bad but because they solved the wrong problem, or ignored a constraint that quietly ruled out half the options. So before generating anything, get clear on the load-bearing facts:

- **The real goal** — the job to be done, not the solution the person may have already half-committed to. ("Reduce document search time" is a goal; "build a RAG pipeline" is already an answer.)
- **Hard constraints** — the things that actually eliminate options: existing stack and vendor commitments, budget, latency/scale targets, timeline, team skills, compliance/data-residency, whether this must integrate with something that already exists.
- **Success criteria** — what "good" looks like, and how they'd know it worked.
- **What's off the table** — anything already tried, ruled out, or politically dead.

Don't interrogate. Infer everything you reasonably can from what they've already said and the surrounding context, and ask only about the one or two unknowns that would most change the answer. A brainstorm that opens with ten clarifying questions has already lost the room. If key facts are genuinely missing, state the assumption you're making and let them correct it, rather than blocking on a question.

### Phase 2 — Diverge

The entire value of divergence is *coverage of the space*. Five variations on the same underlying idea is not a brainstorm; it's one idea wearing five hats. Deliberately reach for approaches that differ on the axes that matter for this kind of problem:

- **Build vs. buy vs. adapt-what-exists** — a from-scratch build, an off-the-shelf/managed product, and a "stretch a tool you already own" option often look completely different.
- **Simple-and-boring vs. sophisticated** — always float a boringly reliable baseline. It's frequently the right answer, and it anchors the others.
- **Managed vs. self-hosted**, **incremental vs. re-architect**, **do-it-now vs. buy-time-with-a-stopgap** — pick the tensions that are alive for this problem.

Aim for three to five distinct approaches. Include at least one that quietly challenges an assumption baked into how the problem was posed — sometimes the best move is to not build the thing at all, or to reframe what's being optimized.

While diverging, **defer judgment**. Don't list an option and immediately shoot it down; that poisons the well and makes the person self-censor. Save the critique for convergence.

Make the options easy to hold in the head: give each a short memorable name and a one-line sketch of how it actually works. Scannable beats exhaustive.

### Phase 3 — Converge

Options with no way to choose between them are just a longer version of being stuck. Convergence is where you earn the session.

- **Evaluate against the criteria from framing**, not a generic checklist. If latency and vendor lock-in are what matter here, compare on latency and lock-in — don't pad the analysis with dimensions nobody cares about.
- **Be honest about the cost of each path.** Every real option trades something away. Naming the downside of the one you like builds far more trust than selling it.
- **Make a recommendation and show the reasoning.** "I'd lean toward B, because your hard constraint is timeline and B is the only one you can ship this quarter — but if the budget line is firmer than the date, A wins." Frame it as a recommendation they can overturn with context you don't have.
- **End with a next step that de-risks the choice** — the smallest experiment, spike, or prototype that would confirm or kill the top option before anyone commits fully. This is what turns a brainstorm into momentum.

## Presenting the output

Keep it scannable — a wall of prose buries the very structure that makes a brainstorm useful. A shape that tends to work (adapt freely):

1. **One or two lines of framing** — the goal and the constraints you're optimizing against, so the person can catch a wrong assumption before reading further.
2. **The options** — each with its name, a one-line how-it-works, and its standout strength/weakness.
3. **A tight comparison** — a small table or a few lines contrasting the options on the two or three criteria that actually decide it.
4. **Recommendation + why** — including the condition under which you'd change your mind.
5. **The de-risking next step.**

Don't mechanically stamp out all five sections every time. A quick brainstorm might be three named options and a one-line rec. Match the weight of the output to the weight of the question.

## What separates this from a generic answer

- **It's specific to their world.** Options and trade-offs are grounded in the actual stack, budget, and constraints on the table — not "here are three cloud providers." If they mentioned Azure and a two-person team, the analysis reflects that.
- **It surfaces the non-obvious.** At least one option or trade-off they probably hadn't considered. If everything you list was already obvious to them, the brainstorm added nothing.
- **It names assumptions out loud.** Both theirs (in how the problem was framed) and yours (in what you're optimizing for). Made explicit, they can be challenged.
- **It converges.** It doesn't leave them holding a menu — it takes a position and explains it, while leaving the final call to them.

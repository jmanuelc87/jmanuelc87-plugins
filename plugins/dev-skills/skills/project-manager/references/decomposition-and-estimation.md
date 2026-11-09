# Decomposition, Estimation, and Sequencing

How to break a goal into work you can plan, estimate it without lying to yourself, and order it so
the timeline is real. Match the rigor to the project — a two-week effort needs a task list and a
critical-path glance, not a formal work-breakdown structure with three-point estimates.

## Contents
1. Decomposition — breaking work down
2. Estimation — sizing it honestly
3. Sequencing — dependencies, critical path, and buffers

---

## 1. Decomposition

Goal → milestones → tasks. The aim is tasks that are **estimable, own-able, and verifiable**.

- **Milestones are demonstrable checkpoints**, not phases. "Auth works end-to-end in staging" is a
  milestone; "phase 2" is not — it can't reveal slippage because you can't show it.
- **A good task** has a clear definition of done, a single owner, and an estimate. If you can't
  estimate it, it's too big or too vague — split it or spike it (time-box a small investigation to
  learn enough to estimate).
- **Decompose by deliverable or outcome, not by activity** where you can. "Searchable user
  profiles" tends to surface integration work that "do the backend / do the frontend" hides.
- **Right-size:** for most teams, tasks in the ~0.5–3 day range are plannable. Much bigger and
  estimates rot; much smaller and tracking them is overhead. Adjust to context.
- **Stop decomposing when further breakdown stops reducing uncertainty.** Detailed plans for work
  three months out are fiction — plan the near term in detail, the far term in milestones, and
  refine as it approaches (rolling-wave planning).

## 2. Estimation

The goal is calibrated honesty, not precision theater.

- **Estimate ranges, not points, when uncertain.** "3–5 days" carries information that "4 days"
  destroys. Single numbers invite false confidence and become commitments by accident.
- **Three-point estimate** for anything material: optimistic (O), most likely (M), pessimistic (P).
  A simple expected value is **(O + 4M + P) ÷ 6**, which weights the likely case while pricing in
  the tail. Use it to set expectations, not to pretend the tail won't happen.
- **Estimate effort and duration separately.** Two days of effort can take a calendar week once you
  account for meetings, context-switching, reviews, and waiting on others. Plans slip on duration,
  not effort.
- **Beware the planning fallacy.** People systematically underestimate, especially their own work
  and especially the integration/test/polish at the end. Reference-class forecasting — "how long
  did similar things actually take?" — beats reasoning up from tasks.
- **Decompose to estimate.** Estimating ten small tasks is more accurate than estimating one big
  one; errors partly cancel instead of compounding in one optimistic guess.
- **Track estimate vs. actual** to calibrate. A team that's consistently 1.5× over has a usable
  multiplier; pretending otherwise just relocates the same slip to the deadline.

## 3. Sequencing

Order and dependencies turn a task list into a timeline.

- **Map dependencies:** for each task, what must finish before it can start. Flag dependencies you
  *don't control* (another team, a vendor, an approval) — they're the most common silent killers
  and need chasing well before they're needed.
- **Find the critical path:** the longest chain of dependent tasks. Its length *is* the minimum
  timeline. A slip on the critical path slips the whole project; a slip on a task with slack may
  cost nothing. Know which tasks have slack and which don't, and aim attention accordingly.
- **Parallelize** independent work to compress the schedule — but watch for resource contention
  (two parallel tasks needing the same person aren't actually parallel).
- **Buffer where uncertainty lives, not everywhere.** Padding every task hides the real risk and
  invites Parkinson's law (work expands to fill the time). Instead, hold a project-level buffer and
  concentrate it around the genuinely uncertain, critical-path tasks.
- **Watch for the late-stage convergence trap:** integration, testing, review, and sign-off all
  pile up near the end and depend on everything before them. They're routinely under-scoped.
  Protect time for them explicitly.
- **Re-sequence when reality changes.** A plan is a hypothesis about order; when a task slips or a
  dependency moves, re-check the critical path rather than assuming the original sequence still
  holds.

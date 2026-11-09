---
name: carry-out
description: >-
  Execute an agreed plan, task, or change end to end: work through the steps in order, verify each
  one against its acceptance criteria, keep a visible record of what was done, and report what
  actually happened. Use this whenever the user says "carry out", "go ahead and do it", "execute
  the plan", "implement the steps", "run through the checklist", "take it from here", "finish the
  remaining tasks", or hands over a plan or task list and expects it to be done rather than
  discussed. Also use when partway through a multi-step job that needs disciplined follow-through
  with verification at each step, not just a summary of what to do.
---

# Carry Out

Your job is to turn an agreed plan into finished, verified work. Do the steps, check them, and tell
the truth about the result. Do not stop at a plan, and do not declare success on steps you did not
check.

Two failure modes to avoid:
- **Drifting from the plan.** Quietly changing scope, skipping a step that looked hard, or adding
  unrequested extras. If a step is wrong or impossible, say so and adjust explicitly; never adjust
  silently.
- **Claiming done without evidence.** Marking a task complete because the code was written, not
  because it runs or meets its criteria.

## Workflow

### 1. Confirm the target

Retrieve the Linear issue using mcp verify its contents and should contain:

 - Context
 - Acceptance Criteria
 - References

Restate in one or two lines what will be carried out and what "done" means.
If a source plan or task list exists, read it in full first. If no plan exists, ask for the
steps or build a short list yourself and show it. Ask only when the answer would change what gets
built or changed; otherwise state the assumption and proceed.

### 2. Build a checklist

Turn the plan into an ordered checklist. For each item, record:
- **Action:** the concrete thing to do.
- **Done when:** a check you can run or observe (a test passes, a file exists, a command succeeds,
  a value matches). If the plan gives no criterion, write one.
- **Dependencies:** items that must finish first.

Keep the checklist in the conversation (or in the task tool if one is available) and update its
status as you go. Do not reorder items unless a dependency forces it, and say so when it does.

### 3. Execute one item at a time

For each item, in order:
1. Do the action with the smallest change that satisfies it. Prefer editing existing files and
   following the project's conventions over introducing new structure.
2. Run the check from "done when". Read the real output; do not assume.
3. If the check passes, mark it done and move on.
4. If it fails, diagnose the cause before retrying. Retry only after changing something. After two
   failed attempts at the same item, stop and report the blocker rather than looping.

Do not batch several unverified items and check them at the end unless they are truly one unit.

### 4. Handle deviations explicitly

When reality differs from the plan, pause the sequence and state:
- what the plan said,
- what you found,
- the adjustment you propose and why.

Proceed with the adjustment if it is clearly within the user's intent and reversible. Ask first if
it changes scope, costs money, touches shared or production systems, deletes data, or is hard to
undo. Actions with external side effects (pushing, sending, deploying, publishing) need explicit
confirmation unless the user already authorized them.

### 5. Verify the whole

After the last item, run the broadest practical check for the whole change: the full test suite,
build, linter, or an end-to-end run of the main flow. If the project has no automated checks, say
so and describe what you verified by hand.

### 6. Report

Finish with a short report:
- **Completed:** each checklist item with its status (done, skipped, blocked) and the evidence
  (command run, result).
- **Deviations:** anything changed from the original plan and why.
- **Not done / blocked:** what remains, the exact blocker, and the decision or input needed.
- **Next step:** the single most useful thing the user should do next, if any.

Report failures with the actual output. If a check did not run, say it did not run. Do not write
"all tests pass" unless you ran them and saw them pass.

## Guardrails

- Stay in scope. Note useful out-of-scope findings in the report instead of acting on them.
- Keep changes reviewable: small, focused, and easy to explain item by item.
- Never bypass failing checks (skipping tests, disabling lint rules, using `--no-verify`) to make
  an item pass. If a check is genuinely wrong, say so and get a decision.
- Respect existing user changes in the working tree; do not revert or overwrite work you did not
  make in this task.
- Do not commit, push, or open a pull request unless the user asked for it.

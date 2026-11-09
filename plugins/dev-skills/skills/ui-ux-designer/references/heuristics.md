# Usability Heuristics & Cognitive Load

Use this when running the usability pass. Each heuristic below includes what it looks like *when violated* (the smell) and the direction of the fix — that's what makes a review actionable rather than abstract.

## Nielsen's 10 heuristics (with smells)

1. **Visibility of system status** — the system keeps the user informed about what's happening.
   - *Smell:* a button does nothing visible after a tap; an upload with no progress; a save with no confirmation; the user can't tell which page/step they're on.
   - *Fix:* loading/disabled states, progress, confirmations, a clear "you are here" indicator.

2. **Match between system and the real world** — speaks the user's language, follows real-world conventions.
   - *Smell:* internal jargon ("orphaned entity", "null state") in user-facing copy; ordering that matches the database, not the user's mental model.
   - *Fix:* relabel in the user's vocabulary; order by what the user reaches for most.

3. **User control and freedom** — clear exits, undo, escape from mistakes.
   - *Smell:* no way to cancel a multi-step flow without losing data; destructive action with no undo; a modal that traps focus with no close.
   - *Fix:* visible back/cancel, undo over confirm-dialogs where feasible, escape routes everywhere.

4. **Consistency and standards** — same words/actions mean the same thing; follow platform conventions.
   - *Smell:* two different date pickers; "Delete" is red here and gray there; a custom control that fights the OS keyboard.
   - *Fix:* one pattern per job; lean on platform/native components unless there's a real reason not to.

5. **Error prevention** — design out the error before it happens.
   - *Smell:* free-text field for something that should be a picker; no confirmation on irreversible actions; easy to submit a half-filled form.
   - *Fix:* constrain inputs, sensible defaults, inline validation, guard rails on destructive actions.

6. **Recognition rather than recall** — show options; don't make users remember.
   - *Smell:* unlabeled icons; a code/ID the user must memorize between screens; hidden actions behind long-press with no hint.
   - *Fix:* labels with icons, carry context forward, make available actions visible.

7. **Flexibility and efficiency of use** — accelerators for experts without burdening novices.
   - *Smell:* power users forced through a beginner wizard every time; no keyboard shortcuts, no bulk actions, no recents.
   - *Fix:* shortcuts, defaults, recents/saved views, bulk operations — layered so novices aren't overwhelmed.

8. **Aesthetic and minimalist design** — every extra element competes with the relevant ones.
   - *Smell:* five "primary" buttons; decorative panels that crowd the task; options shown that 1% of users need.
   - *Fix:* remove or demote; progressive disclosure for the rare stuff; one clear primary action per screen.

9. **Help users recognize, diagnose, and recover from errors** — plain-language errors that say what to do.
   - *Smell:* "Error 0x80004005"; "Invalid input" with no hint which field or why; error styled identically to normal text.
   - *Fix:* say what went wrong, where, and the next step; attach the message to the field; make it visually unmistakable.

10. **Help and documentation** — discoverable, task-focused help when needed.
    - *Smell:* no empty-state guidance; a complex feature with zero affordance for "how"; docs that describe the UI instead of the task.
    - *Fix:* inline hints, useful empty states, contextual help tied to the user's goal.

## Cognitive load & friction audit

Beyond the heuristics, tally the *tax* the interface charges:

- **Decision count** — how many choices between the user and done? Each one is a pause. Can any be removed, deferred, or defaulted?
- **Tap/click/field count** — every required field and screen transition is friction. Is each one earning its place? Could the system infer or remember it?
- **Memory burden** — does the user have to hold anything in their head between steps (a code, a selection, where they were)? Surface it instead.
- **Reading burden** — walls of text, redundant labels, instructions for the obvious. Cut to the minimum that lets the user act.
- **Visual noise** — competing colors, weights, and borders raise the cost of finding the relevant thing. Quiet the chrome so content stands out.
- **Inconsistency tax** — when similar things look or behave differently, the user re-learns each one. Unify.

A useful test: **for the primary task, count the steps and the decisions. Then ask which could be zero.** The best edit usually removes something.

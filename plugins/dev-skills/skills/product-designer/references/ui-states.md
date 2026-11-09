# UI State Catalog

Most interfaces are designed for the moment when everything works and the user has a comfortable amount of data. That moment is a minority of real usage. This file is the checklist for the rest of it. For any screen or component, walk this list and specify every state that can occur — including the copy and the recovery path, not just the name.

## The states, what triggers them, and how to handle them

### Empty (first-run / zero data)
**When:** A new user, a cleared list, a filter with no matches, a fresh account.
**Why it matters:** It's the user's first impression of a feature and the highest-leverage moment to teach and motivate. A blank screen that just says "No items" wastes it.
**Design it as:** A brief explanation of what *will* be here, *why it's valuable*, and a single clear action to fill it. Distinguish **first-run empty** ("Add your first project to get started" + button) from **no-results empty** ("No results for 'xyz' — try a broader search" + clear-filter action). They look similar and need opposite copy: one invites creation, the other offers escape.
**Copy pattern:** Lead with the benefit, not the absence. "Track your spending in one place" beats "No transactions yet."

### Loading
**When:** Data is being fetched or an action is processing.
**Why it matters:** Perceived performance is as real as actual performance. The wrong loading treatment makes a 400ms wait feel like 4 seconds.
**Design it as:**
- < ~300ms: show nothing — a flash of spinner is worse than a tiny delay.
- 300ms–1s: a subtle inline indicator.
- Content loading: **skeleton screens** that mirror the eventual layout — they set expectations and feel faster than a spinner.
- Long/unknown waits: a progress indicator with text about what's happening, and if possible, what the user can do meanwhile.

### Partial / streaming
**When:** Some data has arrived; more is coming. Common with paginated lists, infinite scroll, slow APIs.
**Design it as:** Show what you have immediately. Use skeletons or a "loading more…" affordance at the boundary. Never make the user stare at nothing because the *last* item hasn't loaded.

### Ideal / populated
**When:** The everyday case with a healthy amount of real data.
**Design it as:** This is the one most people start with. Just don't *end* with it. Make sure the hierarchy and primary action still hold up when the screen is full.

### Error
**When:** Something failed — network, validation, server, permission, conflict.
**Why it matters:** Errors are where trust is won or lost. A blamed, confused, or stranded user churns.
**Design it as (in priority order):**
1. **Prevent it** — the best error is one that can't happen. Disable invalid options, validate inline before submit, constrain inputs.
2. **Make it recoverable** — preserve the user's work, offer a retry, give them a way forward. Never dead-end.
3. **Explain it in human terms** — say what happened, why (if knowable), and what to do next. Avoid codes and jargon in the primary message.
**Copy pattern:** No blame ("You entered…" → "That email doesn't look right"), be specific ("Required" → "Add a billing address to continue"), give the next step. Distinguish **field-level** validation (inline, next to the input) from **form-level** (summary at top) from **system** errors (a banner or full-page state with retry).

### Success / confirmation
**When:** An action completed, especially destructive, irreversible, or high-stakes ones.
**Design it as:** Confirm proportionally. A toast for routine saves; a clear state change for bigger actions; an explicit confirmation step *only* for the truly destructive (and prefer undo over a confirm dialog where possible — undo respects the common case, confirm punishes it). Tell the user what happened and what they can do next.

### Offline / connectivity loss
**When:** Mobile especially — the network drops mid-task.
**Design it as:** Detect it, tell the user plainly, preserve their in-progress work, and queue or retry when possible. Decide explicitly what's available offline vs. what must wait.

### No permission / access denied
**When:** The user lacks rights to see or do something.
**Design it as:** Explain why and what to do (request access, switch account, contact admin). Don't show a feature you'll then block — hide or disable it with explanation, depending on whether its existence is itself useful information.

### Edge cases of data
Always pressure-test against:
- **One item** (does the layout look broken with a single entry?)
- **Thousands of items** (does it stay performant and navigable? do you need search/filter/pagination?)
- **Very long strings** (names, titles, URLs — do they truncate gracefully or break the layout?)
- **Missing optional fields** (does the absence look intentional or broken?)
- **Extreme values** (a $0 balance, a 10-year-old date, a negative number, an emoji name)

## Quick checklist per screen

When specifying a screen, answer each: empty? loading? partial? error (prevent/recover/explain)? success? offline? no-permission? one-item? many-items? long-strings? — Mark "N/A" deliberately rather than skipping silently. The act of writing "N/A — this screen never loads async data" proves you considered it.

# Accessibility Checklist

Accessibility is baseline usability that also happens to be legally required in many contexts. A design that works for someone using a screen reader, navigating by keyboard, with low vision, with a motor impairment, or just in bright sunlight one-handed, is a better design for *everyone*. Treat this as part of the spec, not a later audit. Aim for WCAG 2.1/2.2 AA as the default bar.

Run a design against the relevant items below and call out the specific requirements that apply — don't just assert "it's accessible."

## Perceivable

- **Color contrast:** Body text and meaningful UI need at least 4.5:1 against their background (3:1 for large text ≥24px or ≥19px bold, and for icons/UI components). State the actual intent ("dark gray #333 on white") so it can be checked.
- **Never rely on color alone** to convey meaning. A red field also needs an icon or text; a "completed" green dot also needs a label or shape. ~8% of men have some color vision deficiency.
- **Text resizing:** Layout should survive text scaled to 200% without content loss or overlap. Avoid fixed-height containers around text.
- **Images & icons:** Every meaningful image/icon needs a text alternative (alt text or aria-label). Decorative ones should be explicitly marked decorative so screen readers skip them.
- **Don't encode information in placement or sensory cues alone** ("click the button on the right") — describe it by label.

## Operable

- **Keyboard:** Everything actionable must be reachable and operable by keyboard alone, in a logical focus order that follows reading/visual order. No keyboard traps.
- **Visible focus:** The focused element must have a clearly visible indicator. Never remove focus outlines without replacing them with something equally clear.
- **Touch targets:** Tappable areas at least ~44×44px (iOS) / 48×48dp (Android), with spacing so adjacent targets aren't mis-hit. Critical on mobile.
- **Motion & animation:** Respect `prefers-reduced-motion`. Avoid anything that flashes more than 3×/second (seizure risk). Don't make essential information depend on animation.
- **Timeouts:** If something times out, warn the user and let them extend it. Don't silently discard their work.
- **Gestures:** Anything done with a complex gesture (swipe, pinch, drag) needs a simple single-tap alternative.

## Understandable

- **Labels on every input.** A visible label, programmatically associated. Placeholder text is not a label — it vanishes on focus and fails contrast.
- **Clear, specific error identification:** Say which field and what's wrong, in text (see `ui-states.md` error patterns).
- **Predictable behavior:** Don't change context (navigate, submit, reorder) without the user initiating it. Focusing a field shouldn't auto-submit.
- **Plain language:** Match the user's vocabulary. Define jargon or avoid it.

## Robust

- **Semantic structure:** Use real headings, lists, buttons, and landmarks — not divs styled to look like them. A `<button>` is keyboard- and screen-reader-ready for free; a clickable `<div>` is not.
- **Name, role, value:** Every custom control must expose what it is, what it does, and its current state to assistive tech (e.g., a custom toggle announces "Notifications, switch, on").
- **Status messages:** Things like "Saved" or "3 results" should be announced to screen readers (live regions) without stealing focus.

## Fast self-audit (use when a full review is overkill)

1. Could I complete the primary task using only the keyboard?
2. Is every piece of meaning available without relying on color?
3. Does every control have a real label and a visible focus state?
4. Is the text contrast at least 4.5:1?
5. Are touch targets big enough and spaced apart?
6. Does it respect reduced motion?
7. Are errors explained in text, tied to the right field?

If any answer is "no," that's a specific item to fix — name it in the spec.

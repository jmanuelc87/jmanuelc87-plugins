# Accessibility — Practical WCAG 2.2 AA Checklist

Treat this as the floor, woven into every recommendation, not a separate phase. Each item lists what to check and the typical fix. Reference the WCAG success criterion (SC) when you cite it so engineers can look it up.

## Perceivable

- **Text contrast (SC 1.4.3, AA):** normal text ≥ **4.5:1** against its background; large text (≥ 24px, or ≥ 19px bold) ≥ **3:1**. Check the *actual* rendered colors, including text on images/gradients and placeholder/disabled text. *Fix:* darken/lighten, add a scrim behind text on images.
- **Non-text contrast (SC 1.4.11):** UI components and meaningful graphics (button borders, input outlines, focus rings, icons that carry meaning, chart segments) ≥ **3:1**. *Fix:* add/strengthen borders; don't rely on a faint 1px gray line.
- **Don't rely on color alone (SC 1.4.1):** error ≠ "the field turns red." Required ≠ "the label is blue." Status ≠ color-only dots. *Fix:* add an icon, text, pattern, or label alongside color. Critical for the ~8% of men with color-vision deficiency.
- **Text alternatives (SC 1.1.1):** every informative image/icon has an `alt`/accessible name; decorative images have empty `alt=""`. Icon-only buttons have an `aria-label`. *Fix:* name it by its *function* ("Search"), not its appearance ("magnifying glass").
- **Resize / reflow (SC 1.4.4, 1.4.10):** content works at 200% zoom and reflows to a 320px-wide viewport without horizontal scroll or clipping. *Fix:* relative units, no fixed-height text containers, responsive layout.
- **Text spacing (SC 1.4.12):** layout survives increased line-height/letter-spacing without clipping. *Fix:* avoid fixed heights on text containers.

## Operable

- **Keyboard accessible (SC 2.1.1):** every interactive element is reachable and operable by keyboard alone — no mouse-only controls, no keyboard traps (SC 2.1.2). Custom widgets (dropdowns, modals, tabs) need proper key handling. *Fix:* use native elements (`<button>`, `<a>`, `<input>`) where possible; they come with this for free.
- **Visible focus (SC 2.4.7):** the focused element has a clearly visible indicator. *Fix:* never `outline: none` without a strong replacement; ensure the focus ring meets 3:1 against adjacent colors.
- **Focus order (SC 2.4.3):** Tab order follows reading/visual order and is logical. Modals trap focus *inside* while open and return it on close. *Fix:* match DOM order to visual order; manage focus on open/close.
- **Touch target size (SC 2.5.8, AA):** interactive targets ≥ **24×24 CSS px** (aim for ~44×44 for primary mobile actions). Adjacent targets shouldn't be so close that the wrong one is easily hit. *Fix:* increase padding/hit area, add spacing.
- **No motion-only / respect reduced motion (SC 2.3.3):** honor `prefers-reduced-motion`; avoid large auto-playing motion and anything flashing > 3×/sec (SC 2.3.1). *Fix:* gate animation behind the media query; provide a still alternative.
- **Skip & navigation (SC 2.4.1):** a skip-to-content link or landmarks let keyboard users bypass repeated nav.

## Understandable

- **Labels & instructions (SC 3.3.2):** every input has a programmatically associated, visible label (placeholder is **not** a label — it disappears on input). Group related fields with a fieldset/legend. *Fix:* `<label for>`; keep a persistent label.
- **Error identification & suggestion (SC 3.3.1, 3.3.3):** errors are identified in text, tied to the field, and say how to fix it. *Fix:* inline message next to the field, referenced via `aria-describedby`.
- **Consistent navigation & identification (SC 3.2.3, 3.2.4):** the same component is named and placed consistently across the product.
- **Input purpose / autofill (SC 1.3.5):** common fields (name, email, address) use proper `autocomplete` so assistive tech and autofill work.

## Robust

- **Name, role, value (SC 4.1.2):** custom controls expose their role and state to assistive tech (a custom toggle announces "switch, on"). *Fix:* prefer native semantics; add ARIA only to fill gaps, and test it.
- **Status messages (SC 4.1.3):** dynamic updates (toasts, validation, live results) are announced without stealing focus. *Fix:* `aria-live` regions.

## Quick triage order

When time is short, check these first — they block whole classes of users:
1. Keyboard: can you operate the primary task with Tab/Enter/Space alone, and see where you are?
2. Contrast on the primary action and body text.
3. Labels/names on every control (especially icon-only buttons and inputs).
4. Color isn't the only signal for errors/status.
5. Touch targets aren't tiny or crowded.

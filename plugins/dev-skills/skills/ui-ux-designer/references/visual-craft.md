# Visual Craft — Hierarchy, Spacing, Typography, Color, Copy

Use this for the visual pass. The goal is never decoration; it's making the important thing obvious and the structure legible at a glance. Each section gives what to check and the lever to pull.

## Visual hierarchy

The user's eye should land on the most important thing first, without effort.

- **One primary action per screen/section.** It gets the strongest visual weight (filled button, dominant color). Everything else is secondary (outline/tonal) or tertiary (text link). *Smell:* two or more equally loud buttons → the user pauses to choose. *Fix:* promote one, demote the rest.
- **Size, weight, color, and position encode importance** — in that rough order of strength. Use them consistently: the biggest/boldest element should be the most important, not just the longest headline.
- **Squint test:** blur your eyes (or the screenshot). The thing that still stands out should be the thing that matters. If everything is uniform, hierarchy is flat; if random things pop, it's noisy.
- **Don't make everything bold.** If every element shouts, the user hears nothing. Establish a quiet baseline so emphasis means something.

## Spacing & layout

Space is structure. Most "cluttered" interfaces are spacing problems, not content problems.

- **Proximity = relatedness (Gestalt).** Group related items with tighter spacing; separate unrelated groups with more. A label should sit closer to its own field than to the next field. *Smell:* even spacing everywhere → no visible grouping.
- **Use a consistent spacing scale** (e.g. 4/8/12/16/24/32). Arbitrary one-off margins read as sloppy and make the UI feel unstable.
- **Alignment:** establish clear edges; ragged left edges and inconsistent indents create visual noise. Things that align feel intentional.
- **Whitespace is not wasted space.** It gives the eye rest and signals quality. Cramming to "fit more" usually lowers comprehension and conversion.
- **Respect a grid / max content width.** Full-bleed body text on wide screens hurts readability (see line length below).

## Typography

- **Establish a type scale** with a few clear steps (e.g. display / heading / subheading / body / caption). Don't use ten near-identical sizes.
- **Line length:** aim for ~45–75 characters per line for body text. Too wide and the eye loses its place; too narrow and rhythm breaks.
- **Line height:** ~1.4–1.6 for body. Tight leading on long text hurts readability.
- **Limit weights and families.** One or two families, a handful of weights. Consistency reads as polish.
- **Hierarchy through type, not just size:** weight and color do a lot of work; you don't need huge size jumps if weight/spacing differentiate.
- **Body text rarely below ~16px** on the web for comfortable reading; never sacrifice legibility for density without reason.

## Color

- **Color has jobs:** brand, primary action, semantic (success/warning/error/info), and neutral surfaces/text. Keep them distinct and consistent — don't use the error red as a decorative accent.
- **A little goes far.** A mostly-neutral palette with one or two accent colors directs attention better than a rainbow. Every saturated color competes for the eye.
- **Meet contrast minimums** (see accessibility.md) — this constrains palette choices and that's good.
- **Never encode meaning in color alone** (icon/text/label alongside). Restated here because it's both an accessibility and a clarity issue.
- **Consistency across states:** hover/active/disabled/selected should be a coherent system, not ad hoc per component.

## Microcopy

Words are interface. Tightening copy often improves usability more than any visual change.

- **Buttons name the action/outcome:** "Save changes", "Send invite" — not "OK", "Submit", "Yes". The user should know what happens before clicking.
- **Labels in the user's words,** not internal jargon. Short, specific, scannable.
- **Error messages:** say what went wrong, where, and what to do — plain language, blame-free. "Enter a valid email like name@example.com," not "Invalid input."
- **Empty states teach:** an empty list is a chance to explain what goes here and how to add the first one, not a blank void.
- **Cut filler.** "Please note that you may want to consider..." → "Tip:". Remove words that don't help the user act.
- **Be consistent in voice and terminology:** the same thing has the same name everywhere (don't call it "folder" here and "directory" there).

## Quick visual triage

1. Squint test — does the right thing dominate?
2. Is there exactly one primary action, clearly the loudest?
3. Is spacing grouping related things and separating unrelated ones?
4. Is the type scale small and consistent; is body text readable (size, line length, leading)?
5. Is color purposeful and mostly neutral, with accents reserved for action/meaning?
6. Does the button/label copy say what it does?

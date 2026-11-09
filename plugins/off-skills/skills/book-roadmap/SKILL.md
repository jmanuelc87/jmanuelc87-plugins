---
name: book-roadmap
description: >-
  Build a reading roadmap for a subject that mixes core books on the topic with the adjacent
  "sidecar" books the learner actually needs, returned as a table with book, authors, publisher,
  covered topics and focus. Use when the user asks for a book list, a reading roadmap, or what to
  read to learn a subject.
---

# Book Roadmap

Act like an [EXPERT] with several years of [EXPERT_BACKGROUND].

Build a [TOPIC] reading roadmap that mixes pure [TOPIC] texts and the hidden [SIDECAR_TOPIC] books you actually need.

## Inputs

Before answering, ask the user for: [EXPERT], [EXPERT_BACKGROUND], [TOPIC], and [SIDECAR_TOPIC]. Wait for the answers.

## Output

Return the results as a table with the columns:

| Book Name | Author(s) | Editorial | Covered Topics | Focus |
| --- | --- | --- | --- | --- |

## Rules

- Replace every capitalized word in square brackets with the correct context.
- Always respond in English.

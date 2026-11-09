---
name: create-study-plan
description: >-
  Create a multi-week, curated study plan for becoming competitive in a technical topic, with
  books, papers and blogs with direct links, prerequisites, reading pages, replication targets,
  checkpoints, effort estimates and three graded projects. Use when the user asks for a learning
  plan, a study schedule, or a curriculum for a subject over a number of weeks.
---

# Create Study Plan

Act like an [EXPERT] with several years of [EXPERT_BACKGROUND].

Your main task is to recommend a curated selection of topics that will give the learner a competitive advantage in [TOPIC]. Make it [DURATION] weeks long.

The learner's academic background and working experience are in [LEARNER_BACKGROUND].

## Inputs

Before planning, ask the user for: [EXPERT], [EXPERT_BACKGROUND], [TOPIC], [DURATION], and [LEARNER_BACKGROUND]. Wait for the response.

## Instructions

For each week:

- Give relevant resources: books, scientific papers, and blogs.
- Attach direct links to every recommended book, paper, and blog.
- State the learning background required before going deep into each subject.
- Estimate the time needed for each subject.
- Suggest reading pages, paper *replication targets*, and checkpoints.

Return the results as a table with the columns:

| Week | Background | Topic | Reading pages | Links | Replication Targets | Checkpoints | Required Effort |
| --- | --- | --- | --- | --- | --- | --- | --- |

After the table, suggest 3 projects in order of difficulty: medium, hard, and harder.

## Rules

- Replace every capitalized word in square brackets with the correct context.
- Always respond in English.

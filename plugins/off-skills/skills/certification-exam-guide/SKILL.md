---
name: certification-exam-guide
description: >-
  Run a hard, one-question-at-a-time practice exam for the latest version of a cloud provider
  certification, with scenario-based multiple-choice questions, OK/NOK feedback and percentage
  progress. Use when the user wants to practice for, simulate, or quiz themselves on a cloud
  certification exam such as AWS, Azure, or GCP.
---

# Certification Exam Guide

Act as an expert exam simulator. Create a practice test for the *latest version* of the [CLOUD_PROVIDER] exams and make it challenging and comprehensive.

## Inputs

Before starting, ask the user for: [CLOUD_PROVIDER] and [CERTIFICATION]. Wait for the answers.

## Test format

1. **Number of questions:** 35.
2. **Format:** Multiple choice, with 5 options (A, B, C, D, E) per question.
3. **Content focus:** Base questions on *realistic, complex, real-world use case scenarios* relevant to the [CERTIFICATION] scope. Focus on situations that require careful consideration of options.
4. **Delivery:** Present *one question at a time*. Wait for the answer before moving on.
5. **Feedback:** After each answer, say whether it was *'OK' (correct)* or *'NOK' (incorrect)*. Immediately after the feedback, give the *percentage of the test completed*, rounded to the nearest whole number (for example 3%, 6%, 9%, ... 100%). Do not use decimals.
6. **Topic coverage:** Cover *all domains and key topics* in the official [CERTIFICATION] exam guide for the latest version.
7. **Question quality and difficulty:**
   - Keep questions distinct, with minimal conceptual overlap. Avoid repeating the same specific topics or detailed scenarios. Favor broad coverage over deep dives into a few areas.
   - Target a *hard* difficulty for the [CERTIFICATION] certification. Include challenging decision points and plausible but incorrect distractors that require careful reading.

## Rules

- Replace every capitalized word in square brackets with the correct context.
- Always respond in English.

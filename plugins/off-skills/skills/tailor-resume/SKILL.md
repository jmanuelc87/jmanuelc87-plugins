---
name: tailor-resume
description: >-
  Guide the user step by step through building a resume tailored to a specific job: extract the
  role and company requirements from a job posting, rewrite each past experience as action-result
  bullets using the posting's language, and output a Markdown resume with summary, experience,
  education, languages (CEFR) and skills. Use when the user wants to tailor, rewrite, or build a
  resume for a particular job or company.
---

# Tailor Resume

Act as a professional resume writer, skilled at presenting information concisely, using language appropriate to the niche, and avoiding redundancy and cliché terms.

Your task is to position the candidate's experience as a solution to the target company's pain points, tailored so it is clear they can manage the primary requirements of the job. Memorize the information gathered in these steps for the rest of the session.

Follow these steps in order. Ask the candidate and **wait for a response before moving to the next step**.

1. **Job description.** Ask whether the candidate can provide the URL of the job description for the role. If you cannot extract the information from the URL, ask them to paste it. Extract the job title and name it **ROLE**, then note the required experience and responsibilities. Read it carefully; you will be asked questions about it later.

2. **Company.** Ask whether the candidate can provide the URL of the hiring company, then extract:
   - The company name, remembered as **COMPANY**.
   - Key information about its product.
   - Information about its audience.
   - Key messages the company wants to communicate.
   - Key technologies the company uses.

3. **Past roles.** Ask the candidate for each company they worked for, the position, and the dates (month and year). Then move to the next step.

4. **Experience bullets.** Ask about each past work experience. Rewrite each paragraph the candidate gives as a single resume bullet tailored to **ROLE**. Use language similar to the job description. Start each bullet with an action verb, then the task, and end with the result. Memorize each bullet. Keep asking for more experiences until the candidate says they are done, then move to the next step.

5. **Match bullets to companies.** Group the bullets under each company and position as a sub-section of the experience. Repeat steps 3 and 4 until the candidate says they are done.

6. **Summary.** Write 2-4 sentences summarizing the candidate's professional experience, including only what is relevant to **ROLE**. Show how their experience and expertise address **COMPANY**'s pain points. Use resume language in the passive third person. Memorize it.

7. **Education.** Ask for the candidate's education: degree, institution, and graduation year.

8. **Languages.** Ask for the spoken languages and the mastery level of each, using the Common European Framework of Reference for Languages (CEFR).

9. **Skills.** Ask for the candidate's skills and their mastery level on a scale from 1 (novice) to 5 (expert).

10. **Resume.** Create the resume in a Markdown code block with these sections, correcting spelling and grammar errors:
    - Summary
    - Experience
    - Education
    - Languages
    - Skills

## Rules

- Replace every capitalized word in square brackets with the correct context.
- Always respond in English.

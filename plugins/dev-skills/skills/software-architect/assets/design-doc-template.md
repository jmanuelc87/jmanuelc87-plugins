# Design Doc: [System or change name]

> A design doc / RFC for a new system or a substantial change others need to review *before* it's
> built. Optimize for reviewer time: lead with the summary, make the problem and constraints
> unambiguous, and show the design you recommend plus the alternatives you rejected. Delete this
> blockquote and any sections that don't apply — a design doc with empty sections is noise.

- **Author(s):** [name]
- **Status:** Draft | In review | Approved | Implemented
- **Last updated:** YYYY-MM-DD
- **Reviewers:** [who needs to sign off]

## 1. Summary

[3–5 sentences. What are we building, why, and what's the gist of the approach? A reader should be
able to stop here and know whether they need to read the rest.]

## 2. Problem and goals

[What problem does this solve, and for whom? What business outcome does it serve?]

**Goals:**
- [What this must achieve.]

**Non-goals:**
- [What this explicitly does *not* try to do — scoping out is as important as scoping in.]

## 3. Constraints and requirements

[The envelope the design must fit. Be concrete and quantify where you can.]

- **Scale / load:** [users, requests/sec, data volume, growth.]
- **Latency / consistency:** [response budget; strong vs. eventual consistency; sync vs. async.]
- **Team / timeline / budget:** [who's building it, by when, with what.]
- **Compliance / security:** [regulatory, data residency, auth requirements.]
- **Existing constraints:** [stack, systems this must integrate with or not break.]

## 4. Proposed design

[The recommended approach. Start at the level a reviewer needs, then go deeper.]

- **Overview:** [the shape of the solution in a paragraph; a diagram if structure is non-trivial.]
- **Components and responsibilities:** [each piece and what it owns.]
- **Data flow:** [how a request/event moves through; where state lives.]
- **Data model / schema:** [key entities and the shapes that cross boundaries.]
- **APIs / contracts:** [interfaces, error semantics, versioning, idempotency where it matters.]
- **Technology choices:** [what and why; justify any non-boring technology against a boring option.]

## 5. Alternatives considered

[The credible options you rejected and why. This is where reviewers find the holes — make it real.]

- **[Alternative]** — [trade-offs; why not chosen.]

## 6. Failure modes and risks

[How it fails and what you've done about it.]

- **Failure modes:** [per dependency: what happens when it's slow/down/wrong; SPOFs; blast radius.]
- **Scaling limits:** [what breaks first at 10x, and the fix.]
- **Security surface:** [trust boundaries, authz, data exposure, secrets.]
- **Key risks:** [and mitigations / open questions.]

## 7. Operational plan

- **Testing:** [strategy across unit / integration / contract / e2e.]
- **Observability:** [logs, metrics, traces; what you'll alert on.]
- **Rollout and rollback:** [how it ships, how it rolls back, migration plan if any.]

## 8. Open questions

[Unresolved decisions you want input on. Honesty here speeds up review.]

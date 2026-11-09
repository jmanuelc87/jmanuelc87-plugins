# Prioritization Frameworks

Pick the **lightest** framework that fits the decision. A three-item list needs a sentence of
reasoning, not a scoring model. Reach for a structured method when the list is long, the stakes are
high, or stakeholders disagree and you need a defensible, transparent ranking. The framework's job
is to make the reasoning visible and challengeable — never to launder a gut call as math.

## Contents
1. Value vs. Effort (2×2) — the fast default
2. MoSCoW — scoping a release against a fixed constraint
3. RICE — comparing many items with a consistent score
4. WSJF — sequencing when delay has a cost
5. Eisenhower — urgent vs. important, for triage
6. Choosing among them

---

## 1. Value vs. Effort (2×2)

The fastest useful tool. Plot each item on value (impact toward the objective) against effort
(cost/time/feasibility):

- **High value, low effort** → do first (quick wins).
- **High value, high effort** → plan deliberately (big bets — sequence onto the critical path).
- **Low value, low effort** → fill-in / do if cheap (fit around the big work).
- **Low value, high effort** → drop or defer (money pits).

Best for: a quick first cut, small-to-medium lists, getting a room aligned fast. Weakness: "value"
and "effort" are eyeballed — fine for triage, weak for contested high-stakes calls.

## 2. MoSCoW

Sort items into **Must / Should / Could / Won't (this time)**:

- **Must:** the release fails its objective without it.
- **Should:** important but not fatal to omit; painful to drop.
- **Could:** desirable if time allows; first to cut.
- **Won't this time:** explicitly out — recorded so it's a decision, not an oversight.

Best for: scoping a release against a fixed date or budget — it forces the cut conversation up
front. Discipline: keep "Must" small. If everything is a Must, nothing is, and the constraint
will make the cut for you, worse and later.

## 3. RICE

Score each item: **(Reach × Impact × Confidence) ÷ Effort**, then rank by score.

- **Reach:** how many users/events in a period.
- **Impact:** effect per unit (use a fixed scale, e.g. 3 = massive, 1 = medium, 0.25 = minimal).
- **Confidence:** how sure you are of the estimates (as a %), which penalizes wishful thinking.
- **Effort:** person-time, usually person-months or -weeks.

Best for: comparing many candidate items consistently across people, where you want one number and
an audit trail. Weakness: precise-looking output from fuzzy inputs — keep the scales coarse and
treat ties as ties; don't over-trust the second decimal.

## 4. WSJF (Weighted Shortest Job First)

**Cost of Delay ÷ Job Size**, do highest first. Cost of Delay combines business/user value, time
criticality, and risk-reduction/opportunity-enablement.

Best for: sequencing a backlog when delaying things has a real, differing cost — surfaces small,
high-urgency items that big-but-not-urgent work would otherwise crowd out. Weakness: estimating
Cost of Delay is hard; use relative scales rather than chasing absolute currency figures.

## 5. Eisenhower (urgent × important)

A 2×2 of urgent vs. important, for triaging a messy list of demands:

- **Important + urgent** → do now.
- **Important + not urgent** → schedule (the quadrant strategic work lives in — protect it).
- **Not important + urgent** → delegate / minimize (other people's fires).
- **Not important + not urgent** → drop.

Best for: personal/team triage and cutting through "everything is urgent." Weakness: "urgent" is
easily inflated; pair with the real constraint to keep it honest.

---

## 6. Choosing among them

- **Quick call, short list, need alignment fast** → Value vs. Effort.
- **Cutting a release to fit a fixed date/budget** → MoSCoW.
- **Ranking a large backlog defensibly across stakeholders** → RICE.
- **Sequencing where delay itself is costly** → WSJF.
- **Triaging a flood of competing "urgent" demands** → Eisenhower.

Whatever you use, **anchor it to the hard constraint** (the fixed corner of scope/time/cost/
quality) and **show the reasoning**, so the ranking can be argued on substance, not authority.

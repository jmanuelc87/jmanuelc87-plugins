# API Design Doc: [API / Change Name]

> For a new API or a substantial change others need to review. Copy and fill in; delete prompts as
> you go. Keep it as short as the decision warrants — a small change needs a few lines, not all of
> this. The point is to make the contract and its trade-offs reviewable *before* it ships.

**Author:** · **Date:** · **Status:** Draft / In review / Approved · **Reviewers:**

## 1. Summary
One paragraph: what this API does and who it's for.

## 2. Consumers and use cases
- **Audience:** internal / partner / public. How many integrators; can changes be coordinated?
- **Top use cases (the verbs callers care about):**
  1.
  2.
  3.
- **Read/write/real-time shape:** (drives the paradigm)

## 3. Paradigm and rationale
The chosen style (REST / GraphQL / gRPC / webhooks / events) and the trade-off accepted. Why not
the obvious alternative?

## 4. Resources / operations
The main resources or operations and what each owns. A table or short list — not the full spec
(that's the OpenAPI/SDL artifact).

| Operation | Method/Path or Field | Purpose | Notes (auth, idempotency, side effects) |
|-----------|----------------------|---------|------------------------------------------|
|           |                      |         |                                          |

State every **side effect** explicitly (events emitted, downstream calls, cascades).

## 5. Key schemas
The important request/response shapes, with an example. Call out field naming, nullability, dates,
money, and IDs. Note what's deliberately *not* exposed.

```json
// example request / response
```

## 6. Cross-cutting conventions
- **Errors:** the structured error shape and the main error codes.
- **Pagination / filtering / sorting:** which style, applied where.
- **Versioning & compatibility:** how versions are expressed; the compatibility promise.
- **Idempotency:** which operations, and how (e.g. idempotency keys on creates).

## 7. Security
- **Authentication:** mechanism and token lifecycle.
- **Authorization:** the object-level model — who can touch what, enforced where.
- **Data exposure:** what's returned vs. withheld; PII handling; enumeration resistance.
- **Rate limiting / abuse:** limits and the `429` contract.

## 8. Reliability & operability
- **Failure modes:** for each dependency — behavior when slow / down / rate-limited / malformed.
- **Idempotency & retries:** what's safe to retry.
- **Observability:** per-endpoint metrics, correlation IDs, what you'd alert on.
- **Testing:** contract tests; consumer-driven contracts if multiple teams depend on this.

## 9. Alternatives considered
What else was on the table and why it lost. (Keeps the *why* alive for the next person.)

## 10. Open questions / risks
Unresolved decisions, assumptions made in the absence of answers, and known risks.

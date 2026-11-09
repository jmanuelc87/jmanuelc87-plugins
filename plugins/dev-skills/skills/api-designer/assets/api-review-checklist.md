# API / Integration Review Checklist

A working checklist for reviewing an API, schema, endpoint, or integration. Pair it with
`references/security-and-review.md` for the detail behind each item, and `references/design-
conventions.md` for the convention specifics. Don't mechanically tick every box — use it to make
sure you haven't missed a *class* of problem. Then deliver findings **prioritized**: tie each to a
concrete consequence, rank by severity × likelihood and by blast radius (public/partner contracts
outrank internal ones), separate must-fix from should-fix from nice-to-have, and note the effort.

## Contract clarity & consistency
- [ ] A developer could guess the next endpoint after using two — naming/casing/structure is uniform.
- [ ] The same concept is named the same way everywhere; each field means one thing.
- [ ] No verbs in resource paths; methods carry the verb; non-CRUD actions modeled sensibly.
- [ ] Every side effect (events, cascades, downstream calls) is stated in the contract.
- [ ] No hidden behavior (no mutating GET, no surprise get-or-create).

## Schemas & data representation
- [ ] Responses expose only intended fields — no raw internal models serialized out.
- [ ] Dates are ISO 8601 UTC; money is minor-units/decimal (never float) with a currency.
- [ ] IDs are opaque and non-sequential where externally visible (enumeration-resistant).
- [ ] Enums documented; clients told to tolerate unknown future values.
- [ ] Nullability/absence rules are consistent.

## Errors & status codes
- [ ] One structured error shape used everywhere (code, message, details, request_id).
- [ ] Specific, correct status codes (401 vs 403, 400 vs 422, 409, 429) used consistently.
- [ ] Error messages are safe — no stack traces, SQL, paths, or hostnames leaked.
- [ ] A correlation/request ID lets a caller's error be traced to logs.

## Pagination, filtering, versioning
- [ ] One pagination style applied uniformly (cursor for large/changing sets; offset only if bounded).
- [ ] `limit` is capped server-side; clients can tell when to stop.
- [ ] Filter/sort fields are allowlisted, not passed to the query layer raw.
- [ ] A versioning scheme exists if breaking changes are possible; the compatibility promise is stated.
- [ ] No silent breaking changes; deprecations have a timeline and signaling.

## Security
- [ ] Auth mechanism matches the audience; tokens are short-lived/rotatable/revocable.
- [ ] Authorization enforced server-side on every protected operation, at the object level.
- [ ] No IDOR — changing an ID can't return or modify another caller's resource.
- [ ] No mass-assignment — clients can't set fields like `role`/`is_admin`/`account_id`.
- [ ] Rate limits on public and unauthenticated endpoints; `429` with `Retry-After`.
- [ ] TLS everywhere; all input validated and bounded at the boundary.

## Idempotency & reliability
- [ ] GET/PUT/DELETE behave idempotently; creating POSTs support an idempotency key.
- [ ] Every outbound call (for integrations) has a timeout.
- [ ] Retries use backoff + jitter and target only safe/idempotent operations.
- [ ] Resources are bounded (page sizes, payload sizes, concurrency) — no unbounded growth.

## Integration failure modes
For each dependency the integration relies on, the behavior is defined when it is:
- [ ] slow · [ ] down · [ ] rate-limiting you (429) · [ ] returning malformed/partial data
- [ ] No N+1 / chatty cross-service calls on the hot path; batch endpoints where needed.
- [ ] Consumers depend only on the contract, not on timing or undocumented behavior.

## Observability & testability
- [ ] Per-endpoint latency percentiles and error rates are captured (not just averages).
- [ ] Contract tests pin request/response shapes so implementation can't drift from spec.
- [ ] The API is documented (ideally contract-first: spec is the source of truth).

---

### Findings format
For each finding, capture:
- **What & where:** the specific issue and location.
- **Consequence:** the concrete thing that goes wrong (not a vibe).
- **Severity:** must-fix / should-fix / nice-to-have, justified by severity × likelihood × blast radius.
- **Fix & effort:** the recommended change and a rough effort estimate.

And note what's **good** and should be preserved — a review that's all negatives is incomplete.

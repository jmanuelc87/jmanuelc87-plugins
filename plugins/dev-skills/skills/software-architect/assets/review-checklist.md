# Architecture / Code Review Checklist

A working checklist for reviewing a system, design, PR, or codebase. Pair it with
`references/review-dimensions.md` for the detail behind each item. Don't mechanically tick every
box — use it to make sure you haven't missed a *class* of problem. Then deliver findings
**prioritized**: tie each to a concrete consequence, rank by severity × likelihood, separate
must-fix from should-fix from nice-to-have, and note the effort.

## Structure — coupling & cohesion
- [ ] Each component's responsibility is describable in one sentence.
- [ ] A typical change lands in one place, not scattered across many.
- [ ] No circular dependencies; no god object/service; no "everything depends on it" util module.
- [ ] Boundaries follow axes of change and ownership.

## Technical debt
- [ ] Workarounds are tracked, not silently permanent.
- [ ] No significant copy-paste divergence or dead code on the touched paths.
- [ ] Dependencies are reasonably current; no abandoned/known-vulnerable versions.
- [ ] High-interest debt (frequently changed, error-prone) is flagged for paydown.

## Testability
- [ ] Business logic is separable from I/O and testable in isolation.
- [ ] Tests exist at the right level (unit for logic, contract/integration for boundaries).
- [ ] Tests don't depend on sleeps, real clocks, or leaked global state.
- [ ] Failure paths are tested, not just the happy path.

## Reliability & resilience
- [ ] Every network call has a timeout.
- [ ] Retries use backoff + jitter; retryable operations are idempotent.
- [ ] Single points of failure are identified and addressed or accepted knowingly.
- [ ] Resources are bounded (pools, queues, memory); no unbounded growth.
- [ ] For each dependency: defined behavior when it's slow, down, or returns bad data.

## Observability
- [ ] Structured logs with correlation/trace IDs; no secrets or PII in logs.
- [ ] Metrics cover latency percentiles (not just averages), error rate, and saturation.
- [ ] Requests can be traced across service boundaries.
- [ ] Alerts map to symptoms users feel and have runbooks.

## Performance & scalability
- [ ] No N+1 queries; queried columns are indexed.
- [ ] Large result sets are paginated/streamed, not loaded whole into memory.
- [ ] Caches (if any) have an invalidation/staleness story and cold-start protection.
- [ ] The hot path is understood; what breaks first at 10x is known.
- [ ] No premature optimization of cold paths.

## Security
- [ ] Input validated at trust boundaries; no trust of client-supplied data.
- [ ] Authn and authz enforced at the right layer, on every protected operation.
- [ ] Secrets in a secret manager, never in code/config/logs.
- [ ] No injection via string-built SQL/commands; output properly encoded.
- [ ] Least privilege for services and credentials.
- [ ] Public endpoints are rate-limited; PII exposure is minimized.

## Operational readiness
- [ ] Safe deploy and rollback path exists.
- [ ] Schema/data migrations run without downtime or locking.
- [ ] Health checks and sensible config defaults exist.
- [ ] Likely failures have runbooks; the system has a defined owner.
- [ ] The "could the team run this without the author?" test passes.

---

### Findings format

For each finding, capture:
- **What & where:** the specific issue and location.
- **Consequence:** the concrete thing that goes wrong (not a vibe).
- **Severity:** must-fix / should-fix / nice-to-have, justified by severity × likelihood.
- **Fix & effort:** the recommended change and a rough effort estimate.

And note what's **good** and should be preserved — a review that's all negatives is incomplete.

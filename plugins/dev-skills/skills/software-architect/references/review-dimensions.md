# Review Dimensions

Detailed guidance for reviewing a system, design, PR, or codebase. Each dimension lists what to
look for and the concrete smells that signal a problem. Use this alongside
`assets/review-checklist.md`. You don't have to apply every dimension to every review — pick the
ones the change actually touches, but scan the list so you don't miss a class of problem.

## Contents
1. Coupling and cohesion
2. Technical debt
3. Testability
4. Reliability and resilience
5. Observability
6. Performance and scalability
7. Security
8. Operational readiness

---

## 1. Coupling and cohesion

The structural core. Most long-term pain is mis-drawn boundaries.

**Look for:** modules that change together but live apart (low cohesion); modules that must change
in lockstep across a boundary (tight coupling); a module that knows the internals of another;
god objects/services that own too much; shared mutable state across boundaries.

**Smells:** a "utils" or "common" module everything depends on; changing one feature requires
edits in five places; circular dependencies; a data model shared by writes from many services;
"shotgun surgery" (one change scattered everywhere); feature envy (a method more interested in
another object's data than its own).

**The test:** can you describe what each component owns in one sentence, and does a typical change
land in one place? If not, the boundaries are wrong.

## 2. Technical debt

Debt isn't inherently bad — it's leverage. The question is whether it's *tracked* and *serviced*.

**Look for:** workarounds with no follow-up, copy-paste divergence, dead code, abstractions that
no longer fit, dependencies pinned to ancient versions, TODOs that are years old.

**Smells:** comments like "temporary fix" in long-lived code; the same bug fixed in three places
differently; "we can't touch that module"; tests disabled rather than fixed.

**Frame it economically:** what does this debt cost per change, and what's the interest rate? Some
debt should be paid down now (high-traffic, high-interest); some should be left alone (stable,
rarely touched). Don't moralize — prioritize.

## 3. Testability

Testability is a design property, not a phase. Hard-to-test code is usually badly coupled code.

**Look for:** pure logic separated from I/O; seams where dependencies can be substituted;
deterministic behavior; tests at the right level (unit for logic, integration/contract for
boundaries, end-to-end sparingly).

**Smells:** business logic that can only be exercised by spinning up the whole system; tests that
require sleeping for timing; heavy mocking that just mirrors the implementation (tests that break
on every refactor without catching bugs); no way to test a failure path; static/singleton state
that leaks between tests.

**The test:** to test this unit, how much of the world do you have to stand up? The answer should
usually be "very little."

## 4. Reliability and resilience

How the system behaves when things go wrong — and things always go wrong.

**Look for:** explicit handling of dependency failure (timeouts, retries with backoff, circuit
breakers); idempotency on operations that can be retried; graceful degradation; bounded resource
use (connection pools, queues, memory).

**Smells:** no timeout on a network call (the deadliest default); retries without backoff or jitter
(retry storms); unbounded queues/buffers; a single point of failure with no plan; assuming the
network is reliable; "it can't happen" handling of inputs that can happen.

**Ask:** for each external dependency — what happens when it's slow, down, or wrong? If the answer
is "we hang" or "we crash," that's a finding.

## 5. Observability

You can't operate what you can't see. This must exist *before* the incident.

**Look for:** structured logs with correlation/trace IDs; metrics for the things you'd page on
(latency percentiles, error rate, saturation); tracing across service boundaries; logs that
capture enough context to debug without a reproduction.

**Smells:** logging that's either silent or a firehose; only averages, no percentiles (p50 hides
the pain p99 feels); no way to follow one request across services; secrets or PII in logs;
alerting on causes instead of symptoms (or vice versa with no runbook).

**The test:** when this pages at 3am, can the on-call engineer answer "what's broken and why" from
the telemetry alone?

## 6. Performance and scalability

Performance is about now; scalability is about the slope as load grows. Don't optimize without
evidence, but don't design in known cliffs either.

**Look for:** awareness of the hot path; appropriate caching with a clear invalidation story;
pagination/streaming for large results; understanding of which operations are O(n) in users/data.

**Smells:** N+1 queries; loading an unbounded result set into memory; caching without an
invalidation or staleness story; premature optimization of cold paths; chatty cross-service calls
in a loop; synchronous work that should be async; missing indexes on queried columns.

**Frame it:** what breaks first at 10x, and is the fix a config change, an architectural change,
or a rewrite? Distinguish "won't scale" from "won't scale *yet*."

## 7. Security

Treat every trust boundary as adversarial. This dimension is non-negotiable even under deadline
pressure — a fast insecure system is a liability.

**Look for:** input validation at trust boundaries; authn and authz checked at the right layer
(not just the UI); least privilege for services and credentials; secrets in a secret manager, not
code or config; encryption in transit and (where warranted) at rest; output encoding to prevent
injection.

**Smells:** trusting client-supplied data; authorization checked once and assumed thereafter;
secrets in source control or environment dumps; SQL/command built by string concatenation; overly
broad IAM/permissions; PII logged or returned beyond need; missing rate limiting on public
endpoints; dependencies with known CVEs.

**Ask:** who can reach this, what can they send, and what's the worst thing they can do with it?

## 8. Operational readiness

Can a team actually run this in production at 3am without the author present?

**Look for:** safe deploy and rollback; zero-downtime schema/data migrations; documented runbooks
for likely failures; sensible defaults and config; health checks; resource limits and capacity
headroom.

**Smells:** deploys that can't be rolled back; migrations that lock tables or require downtime;
"only Priya knows how to restart it"; config that must be hand-edited in prod; no health endpoint;
alerts with no runbook; no defined owner.

**The test:** if the author won the lottery and quit tomorrow, could the rest of the team operate,
debug, and change this system? The gaps in that answer are your findings.

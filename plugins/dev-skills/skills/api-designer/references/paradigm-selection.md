# Paradigm Selection

Choosing the interaction style is the highest-leverage API decision — it's expensive to reverse
once consumers exist. Match the paradigm to how the API is actually consumed, not to fashion or
familiarity. Most systems end up mixing a couple (e.g. a REST API that also emits webhooks); that's
normal and good. State the trade-off you're accepting whenever you pick one.

## Contents
1. Quick decision guide
2. REST
3. GraphQL
4. gRPC / RPC
5. Webhooks
6. Event-driven / async messaging
7. Mixing paradigms

---

## 1. Quick decision guide

- Resource-oriented CRUD, broad/unknown consumers, want HTTP caching and ubiquity → **REST**.
- Clients need varied, nested, client-specified shapes; over/under-fetching hurts; many distinct
  views → **GraphQL**.
- Internal service-to-service, you own both ends, want performance + a strict typed contract →
  **gRPC/RPC**.
- You need to *push* notifications to consumers when something happens → **Webhooks**.
- Producers and consumers should be decoupled in time; integration unit is an event; you need
  buffering, fan-out, or replay → **Event-driven / messaging**.

When in doubt for a public or partner API, REST is the conservative default: every client speaks
HTTP, it caches well, and it's the least surprising to integrators.

## 2. REST

**Fits:** resource-centric domains, public and partner APIs, broad heterogeneous clients, anything
that benefits from HTTP caching and intermediaries.

**Strengths:** universal client support, leverages HTTP (caching, status codes, content
negotiation, idempotency semantics), easy to inspect and debug, statelessness scales horizontally.

**Costs / watch for:** over- and under-fetching (clients get too much or must make many calls);
chatty workflows that need several round-trips to assemble a view; mapping non-CRUD actions
("publish", "refund", "retry") onto nouns can feel forced — model those as sub-resources or
explicit action endpoints rather than distorting the resource model.

**Maturity note:** full HATEOAS/hypermedia is rarely worth it — most clients hardcode paths anyway.
Resource-oriented design with consistent conventions captures the value without the ceremony.

## 3. GraphQL

**Fits:** rich frontends and aggregation layers where clients need many different shapes of nested
data, and where reducing round-trips and payload bloat materially improves the experience. Strong
when one backend serves web + mobile + partners each wanting different fields.

**Strengths:** clients fetch exactly what they need in one request; strongly typed schema with
introspection; great tooling; schema evolves additively (deprecate fields rather than version).

**Costs / watch for:** server complexity moves up sharply; HTTP caching no longer works out of the
box (everything is one POST endpoint); **query cost is the central risk** — a nested query can be
catastrophically expensive, so you need depth limits, cost analysis, and persisted queries; the
N+1 problem requires dataloaders/batching; authorization must be enforced per-field, not per-
endpoint, which is easy to get wrong. Don't adopt GraphQL for a handful of fixed read paths — that's
all cost, no benefit.

## 4. gRPC / RPC

**Fits:** internal service-to-service communication where you control client and server, want low
latency and high throughput, and want a strict, code-generated, typed contract (Protobuf).

**Strengths:** compact binary payloads, HTTP/2 multiplexing and streaming (server, client, bidi),
contract-first by construction, generated clients in many languages, strong backward-compat rules
if you follow Protobuf field-numbering discipline.

**Costs / watch for:** poor browser support without a proxy (grpc-web); binary payloads are harder
to inspect/debug than JSON; less universal for public/partner consumers; you must follow Protobuf
evolution rules (never reuse or renumber fields) or you break wire compatibility silently. For
public APIs, prefer REST or GraphQL; reserve gRPC for the internal mesh.

## 5. Webhooks

**Fits:** notifying *consumers'* systems when an event occurs (payment succeeded, job finished),
so they don't have to poll.

**Design as first-class, not an afterthought:**
- **Delivery & retries:** at-least-once with exponential backoff; consumers must be idempotent
  because they *will* receive duplicates. Give each event a stable ID.
- **Security:** sign every payload (HMAC) so the consumer can verify authenticity; document the
  verification; support secret rotation. Never trust an unsigned webhook.
- **Payload shape:** include event type, event ID, timestamp, and either the full resource or a
  reference the consumer can fetch (thin vs. fat payloads — thin is safer for sensitive data).
- **Consumer ergonomics:** let them register/manage endpoints, see delivery attempts and failures,
  and replay. Time out fast and retry rather than blocking on a slow consumer.
- **Ordering:** don't promise strict ordering unless you can guarantee it; include sequence
  numbers or timestamps so consumers can reorder if they need to.

## 6. Event-driven / async messaging

**Fits:** decoupling producers from consumers in time; one event consumed by many; workloads that
need buffering, backpressure, fan-out, or replay; long-running or spiky processing. Backed by a
broker (Kafka, SQS/SNS, Pub/Sub, RabbitMQ).

**Strengths:** temporal decoupling (producer doesn't wait or even know who consumes), natural
fan-out, buffering absorbs spikes, consumers scale independently, replay enables rebuilds and new
consumers.

**Costs / watch for:** eventual consistency becomes the default — the rest of the system must
tolerate it; debugging spans async hops and needs correlation IDs and tracing; you must define
delivery semantics (at-least-once is typical → consumers must be idempotent) and ordering
guarantees explicitly; the **event schema is a contract** — version it and evolve it additively,
because old events live forever in the log. Don't introduce a broker between two services that
could just make a synchronous call; the operational and reasoning cost is real.

**Event design:** model events as facts that happened ("OrderPlaced"), not commands; make them
self-describing with a versioned schema; decide thin (ID + type, consumer fetches) vs. fat (full
state in the event) deliberately — fat events reduce coupling-back-to-source but can leak data and
grow large.

## 7. Mixing paradigms

Real systems combine these, and that's correct when each piece fits its job:

- A **REST** API for synchronous CRUD **plus webhooks** for push notifications — extremely common.
- **gRPC** internally between services, **REST or GraphQL** at the public edge.
- A **GraphQL** gateway aggregating several **REST/gRPC** backends.
- Synchronous **REST** for the request path **plus events** for downstream side effects (so the
  caller isn't blocked on them).

The discipline is the same throughout: each interface is a contract, each must be consistent,
secure, observable, and evolvable, and every side effect must be stated.

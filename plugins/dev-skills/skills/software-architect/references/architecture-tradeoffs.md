# Architecture Trade-offs

How to reason about and present the recurring forks in system design. Read this when the user is
facing one of these decisions. The goal is never to hand down a universal "right answer" — it's to
surface what each choice optimizes for and what it costs, then tie the recommendation to *their*
constraints.

**General method for any trade-off:**
1. Name what's actually being optimized (latency? team autonomy? time-to-market? cost?).
2. State what each option costs you — the door it closes.
3. Map it to the user's real constraints (scale, team, timeline, reversibility).
4. Recommend, and say what would change your mind.

---

## Monolith vs. microservices

**Default to a (well-modularized) monolith.** Microservices solve *organizational* and *scaling*
problems, not code-quality problems — and they introduce distributed-systems problems you didn't
have: network failure, partial failure, data consistency across services, deployment
orchestration, distributed tracing, versioned contracts.

- **Monolith wins when:** the team is small (say, under ~15–20 engineers), the product is still
  finding its shape, or you don't yet have independent scaling needs. A modular monolith with
  clean internal boundaries gets you most of the benefits with far less operational cost, and it
  keeps the *option* to split later along seams you've already drawn.
- **Microservices win when:** multiple teams need to deploy independently without coordinating,
  distinct components have genuinely different scaling or availability profiles, or the codebase
  has grown past what one deploy pipeline can safely handle.
- **The trap:** splitting into services before you understand the domain boundaries, so the seams
  are wrong and every change still touches multiple services — now with network calls between them.

## Synchronous vs. asynchronous

The question is whether the caller needs the result *now* to proceed.

- **Synchronous (request/response)** when the caller can't continue without the answer and the
  latency budget allows it. Simpler to reason about, easier to debug, but couples availability:
  if the callee is down, the caller is too.
- **Asynchronous (queue/event)** when the work can happen later, when you need to absorb load
  spikes (the queue as a buffer), when you want to decouple producer and consumer lifecycles, or
  when one event has many interested consumers. Costs: eventual consistency, harder debugging,
  delivery/ordering semantics to reason about, and the operational weight of a broker.
- **The trap:** going async "for scale" before you have the scale, paying the complexity tax for
  a benefit you don't yet need. Also: async doesn't remove the failure, it relocates it — now you
  own dead-letter handling and retry logic.

## SQL vs. NoSQL

Start relational unless you have a concrete reason not to. SQL databases are mature, give you
transactions, flexible querying, and strong consistency, and scale far further than people assume.

- **Relational wins** for most applications: structured data, relationships, ad-hoc queries,
  transactional integrity. "We might need to scale" is not a reason to abandon it on day one.
- **Document stores win** when the schema is genuinely fluid or the access pattern is
  "fetch one big object by key."
- **Key-value / wide-column win** at very high scale with simple, known access patterns where you
  can denormalize and give up ad-hoc querying.
- **Specialized stores** (search, time-series, graph, vector) win when the access pattern is their
  whole reason to exist — don't bolt that pattern onto a general store if it's core to the product.
- **The trap:** choosing NoSQL for "scale" and then discovering you need joins, transactions, and
  ad-hoc queries — and reimplementing them badly in the application.

## Build vs. buy

Your engineering time is the scarcest resource. Spend it on what differentiates you.

- **Buy / use a managed service or library** for undifferentiated heavy lifting: auth, payments,
  email, queues, search, observability, most infrastructure. The total cost of owning these
  yourself — including on-call, security patching, and the features you'll inevitably need — dwarfs
  the subscription.
- **Build** when it's core to your value proposition, when no option fits and the gap is real
  (not aesthetic), or when the long-term cost/lock-in of buying is genuinely prohibitive.
- **The trap on both sides:** building a worse version of a commodity (NIH syndrome), or buying a
  rigid product for something that *is* your core differentiator and being unable to evolve it.

## Caching

A cache is a correctness liability traded for performance. Only add one against evidence (a
measured hot, slow, or expensive path), and always with an answer to: *how does stale data get
invalidated, and what's the worst case if it's wrong?* The two hard problems are invalidation and
the thundering herd on a cold cache. Don't cache to paper over an N+1 or a missing index — fix the
underlying query first.

## Premature abstraction and generality

"We might need to support other X later" is the most expensive sentence in software. Build for the
two or three cases you actually have; the right abstraction is far easier to see once you've
written the concrete cases. A little duplication is cheaper than the wrong abstraction. Reach for
generality when the third real case arrives, not in anticipation of an imagined one.

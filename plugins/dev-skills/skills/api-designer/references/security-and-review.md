# Security and Review Dimensions

Guidance for securing an API and for reviewing an existing API or integration. Each section lists
what to look for and the concrete smells that signal a problem. Pair it with
`assets/api-review-checklist.md`. You don't have to apply every dimension to every review — pick the
ones the design touches, but scan the list so you don't miss a class of problem. Security is
non-negotiable even under deadline pressure: a fast insecure API is a liability.

## Contents
1. Authentication
2. Authorization
3. Data exposure
4. Rate limiting and abuse
5. Input validation and transport
6. Contract clarity and consistency (review)
7. Error handling (review)
8. Versioning and backward compatibility (review)
9. Integration: coupling, latency, reliability, failure modes (review)

---

## 1. Authentication

**Look for:** an auth mechanism matched to the audience — OAuth2/OIDC with short-lived tokens for
user-facing and third-party access, API keys for server-to-server with rotation, mTLS for internal
service meshes. Tokens scoped to least privilege. A clear story for token expiry, refresh, and
revocation.

**Smells:** long-lived or never-expiring tokens; API keys in URLs (they land in logs and browser
history) instead of headers; no revocation path; passwords or secrets accepted on every request;
auth that's optional on "internal" endpoints that are actually reachable.

## 2. Authorization

The most commonly broken control, and the highest-impact. Authentication says *who you are*;
authorization says *what you may touch* — and it must be checked server-side on every protected
operation.

**Look for:** object-level checks ("can *this* caller access *this specific* record?"), not just
"is the caller logged in"; authorization enforced in the API/service layer, never relied upon from
the UI; consistent enforcement across every endpoint that touches a resource.

**Smells:** **IDOR** — `GET /orders/{id}` returns any order if you change the ID, because only
authentication was checked; authorization checked once at login and assumed thereafter; admin-only
fields/actions gated only by hiding them in the client; a new endpoint that forgot the check the
others have. Test the "can I read/modify someone else's object by guessing its ID?" question
explicitly.

## 3. Data exposure

The API should return the minimum necessary and accept only what it should.

**Look for:** response schemas that expose only intended fields (allowlist, not "serialize the whole
model"); explicit separation between what's readable and what's writable; PII minimized and access
to it logged.

**Smells:** serializing internal DB rows straight to JSON (leaks columns like `password_hash`,
`internal_notes`, soft-delete flags); **mass assignment** — binding the request body straight onto a
model so a client can set `role`, `is_admin`, `account_id`, or `verified`; sequential integer IDs
that let an attacker enumerate volume and walk the dataset; verbose error messages that leak stack
traces, SQL, file paths, or internal hostnames; over-broad GraphQL queries returning fields the
caller shouldn't see because authorization wasn't enforced per-field.

## 4. Rate limiting and abuse

**Look for:** rate limits on public and especially unauthenticated endpoints; limits keyed
appropriately (per API key, per user, per IP); a `429` response with `Retry-After` and standard
rate-limit headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`); protection for
expensive operations (search, export, GraphQL deep queries) beyond a simple request count.

**Smells:** no limits on login/signup/password-reset (credential stuffing, enumeration); unbounded
list endpoints with no max page size; expensive queries with no cost ceiling; rate limits that
return `403` or `500` instead of `429`, so clients can't back off correctly.

## 5. Input validation and transport

**Look for:** TLS everywhere, no plaintext fallback; every input validated and bounded at the
boundary (types, ranges, lengths, allowlisted enum/sort/filter values); request body size limits;
content-type enforced.

**Smells:** trusting client-supplied data (lengths, IDs, prices echoed back and trusted); filter or
sort params passed into a query builder unsanitized (injection, full-table scans on unindexed
columns); no max on array/string sizes (memory exhaustion); accepting and reflecting arbitrary
fields.

## 6. Contract clarity and consistency (review)

**Look for:** endpoints whose behavior is predictable from their shape; consistent naming, casing,
and field meaning across the whole surface; consistent pagination/filtering/sorting; documented,
stable enums; every side effect stated.

**Smells:** the same concept named three ways; pagination that differs per endpoint; a `GET` with
side effects; "get-or-create" or other hidden behavior; optional fields with unstated meaning or
unstated defaults; an endpoint you can't predict the response of without reading the source. **The
test:** could a developer guess the next endpoint correctly after using two? If not, it's
inconsistent.

## 7. Error handling (review)

**Look for:** one structured error format used everywhere; correct, specific status codes; machine-
readable error codes clients can branch on; field-level validation detail; a correlation/request
ID; messages safe to surface.

**Smells:** errors that vary by code path (sometimes a string, sometimes an object, sometimes a
bare 500); wrong codes (200 with an error in the body; 500 for a validation error; 404 vs 403 used
inconsistently); messages that leak internals; no way to correlate an error to a log line.

## 8. Versioning and backward compatibility (review)

**Look for:** a stated compatibility promise; additive evolution; a versioning scheme if breaking
changes are possible; a deprecation process with timelines and `Deprecation`/`Sunset` signaling.

**Smells:** breaking changes shipped silently (field removed/renamed, type changed, validation
tightened, new required field, changed defaults); no version strategy on a public API; "we'll just
tell consumers" when there are unknown public integrators; enum values added without telling clients
to tolerate unknowns. **Ask:** what breaks for an existing caller when this change ships?

## 9. Integration: coupling, latency, reliability, failure modes (review)

When reviewing how a system *consumes* an API (or how two services integrate), the contract is only
half of it — how the call behaves under stress is the other half.

**Coupling — look for:** the consumer depends only on the contract, not on undocumented behavior or
response timing; no shared database between services masquerading as integration; changes on one
side don't force lockstep changes on the other.
**Smells:** consumers parsing fields they shouldn't rely on; two services reading/writing the same
table; a "small" API change that breaks three consumers.

**Latency — look for:** awareness of the call's place on the hot path; batch/bulk endpoints where a
consumer would otherwise loop; avoidance of chatty N+1 cross-service calls; caching with a clear
staleness story where appropriate.
**Smells:** a UI screen that needs 8 sequential API calls to render; calling a remote API inside a
loop; no caching on a hot, slow, rarely-changing read.

**Reliability — look for:** every outbound call has a **timeout**; retries use backoff + jitter and
target only idempotent/safe operations; a circuit breaker or fallback when a dependency is down;
graceful degradation; bounded concurrency so a slow dependency can't exhaust the caller's resources.
**Smells:** no timeout (the deadliest default — one slow dependency hangs the whole caller); retries
without backoff (retry storms that amplify an outage); retrying a non-idempotent `POST` and
double-charging; treating the network as reliable.

**Failure modes — ask for each dependency:** what happens when it's *slow*? *down*? *rate-limiting
you* (`429`)? *returning a malformed or partial payload*? *returning success but wrong data*? If the
answer is "we hang," "we crash," or "we corrupt state," that's a finding. The happy path is the easy
half; the design is judged by how it fails.

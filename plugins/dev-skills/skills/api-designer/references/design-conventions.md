# Design Conventions

The concrete conventions that make an API predictable. The goal throughout is that a caller who has
used one endpoint can guess the rest correctly. Apply these uniformly; consistency is the feature.
Where an org already has conventions, follow them over these unless there's a strong reason —
internal consistency beats external "correctness."

## Contents
1. Naming and resource modeling
2. HTTP methods and status codes
3. Error format
4. Pagination
5. Filtering, sorting, field selection
6. Versioning and compatibility
7. Idempotency
8. Data representation conventions

---

## 1. Naming and resource modeling

- **Resources are plural nouns:** `/orders`, `/orders/{id}`, `/orders/{id}/line-items`. Avoid verbs
  in paths — the method carries the verb.
- **Hierarchy reflects ownership/containment:** `/customers/{id}/orders` when orders belong to a
  customer. Don't nest more than ~2 levels deep; past that, prefer top-level resources with filters.
- **Actions that aren't CRUD:** when an operation genuinely isn't create/read/update/delete
  (publish, cancel, refund, retry), model it as a sub-resource state change (`PATCH` the status)
  or an explicit action endpoint (`POST /orders/{id}/refunds`). Don't contort it into fake CRUD.
- **Casing:** pick one for paths (kebab-case is conventional: `/line-items`) and one for JSON
  fields (`snake_case` or `camelCase`) and never mix within an API.
- **Consistency rules:** the same concept has the same name everywhere; the same field means the
  same thing in every response; booleans read as predicates (`is_active`, `has_shipped`).

## 2. HTTP methods and status codes

**Methods (REST):**
- `GET` — read, no side effects, safe and idempotent. Never mutate on a GET.
- `POST` — create, or non-idempotent actions. Returns `201` with the created resource (and a
  `Location` header) on create.
- `PUT` — full replace; idempotent. `PATCH` — partial update.
- `DELETE` — remove; idempotent (deleting an already-deleted resource returns the same result).

**Status codes — use the specific one, not a generic 200/500 for everything:**
- `200` OK, `201` Created, `202` Accepted (async, not yet done), `204` No Content (successful, no
  body — e.g. delete).
- `400` Bad Request (malformed/invalid), `401` Unauthorized (not authenticated), `403` Forbidden
  (authenticated but not allowed), `404` Not Found, `409` Conflict (e.g. duplicate, version
  conflict), `422` Unprocessable Entity (well-formed but semantically invalid — common for
  validation), `429` Too Many Requests (rate limited).
- `500` Internal Server Error (your bug), `503` Service Unavailable (down/overloaded, often with
  `Retry-After`).

Distinguish `401` vs `403`, `404` vs `403` (leak-conscious: sometimes return `404` instead of `403`
to avoid revealing a resource exists), and `400` vs `422` consistently.

## 3. Error format

One structured error shape used **everywhere** — inconsistent errors are a top DX failure. A solid
default:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "The request body was invalid.",
    "details": [
      { "field": "email", "code": "invalid_format", "message": "Not a valid email address." }
    ],
    "request_id": "req_01HX..."
  }
}
```

- **`code`** is a stable, machine-readable string (not a number that overlaps HTTP status) clients
  can branch on. Keep the set documented and stable.
- **`message`** is human-readable and safe to surface; never leak stack traces, SQL, or internal
  hostnames.
- **`details`** carries field-level validation errors so a client can map them to form fields.
- **`request_id`** lets a caller (and your support) correlate to logs. Include it on errors at
  minimum, ideally on all responses.

Apply the same shape to every paradigm: GraphQL has its own `errors` array (use `extensions` for
the `code`), but the *content* discipline is identical.

## 4. Pagination

Pick **one** style and apply it everywhere.

- **Cursor (keyset) pagination** — the default for large or frequently-changing collections. The
  server returns an opaque `next_cursor`; the client passes it back. Stable under concurrent
  inserts/deletes (no skipped/duplicated rows), and O(1) per page.
  ```
  GET /orders?limit=50
  → { "data": [...], "next_cursor": "eyJpZCI6..." , "has_more": true }
  GET /orders?limit=50&cursor=eyJpZCI6...
  ```
- **Offset/limit** — acceptable only for small, bounded, slow-changing sets where "page 5" is
  meaningful. It breaks under concurrent modification (rows skip or repeat) and degrades O(n) as
  offset grows. Don't use it for unbounded feeds.

Always cap `limit` with a server max; document the default. Return enough metadata (`has_more` or a
`next` link) that the client knows when to stop without guessing.

## 5. Filtering, sorting, field selection

Define the syntax once and reuse it:

- **Filtering:** `GET /orders?status=shipped&created_after=2025-01-01`. For richer needs, adopt a
  consistent operator convention (`?price[gte]=100`) — but don't build a query language unless the
  use cases truly need it.
- **Sorting:** `?sort=-created_at,name` (leading `-` = descending). One convention, documented.
- **Field selection / sparse responses:** `?fields=id,status,total` to let clients trim payloads
  (poor man's GraphQL for REST). Optional, but valuable for mobile/bandwidth-sensitive clients.
- Validate filter/sort fields against an allowlist — never pass them through to a query builder
  raw (injection + accidental full-table scans on unindexed columns).

## 6. Versioning and compatibility

The cheapest version is the one you never cut. **Design additively so v2 is rare.**

**What's a breaking change (requires a version or a deprecation cycle):**
- Removing or renaming a field, endpoint, or enum value.
- Changing a field's type, format, or meaning.
- Adding a new *required* request field or tightening validation.
- Changing default behavior, error codes, or status codes.

**What's safe (additive):**
- Adding new optional request fields, new response fields, new endpoints, new optional enum values
  (if clients are told to tolerate unknown values).

**How to express versions** (pick one, document it):
- **URL path** (`/v1/orders`) — most visible and cache-friendly; coarse-grained. Common for public
  APIs.
- **Header / media type** (`Accept: application/vnd.acme.v1+json`) — keeps URLs clean; less obvious
  to casual users.
- **GraphQL/gRPC** typically avoid version numbers entirely: deprecate fields (`@deprecated`) /
  add new fields with new numbers, and evolve in place.

**Deprecation:** announce, give a timeline, emit a `Deprecation`/`Sunset` header, and monitor usage
of the old shape before removal. Never break consumers silently.

## 7. Idempotency

Make retries safe so a flaky network can't double-charge or double-create.

- `GET`, `PUT`, `DELETE` are idempotent by definition — design them to behave that way.
- For `POST` that creates or has effects, support an **idempotency key**: the client sends
  `Idempotency-Key: <uuid>`; the server processes the first request, stores the result keyed by it,
  and returns the *same* result for any retry with the same key (for a bounded window). Essential
  for payments, orders, and anything money- or side-effect-bearing.
- Document the window and what constitutes a "same" request (usually key + matching body).

## 8. Data representation conventions

Small choices, applied consistently, that prevent a long tail of bugs:

- **Dates/times:** ISO 8601, UTC, with offset (`2025-06-29T14:30:00Z`). Never ambiguous local time.
- **Money:** integer minor units (cents) *or* decimal strings — **never** floats (rounding errors).
  Always pair an amount with a currency code.
- **IDs:** prefer opaque, non-sequential IDs (UUID/ULID) for anything externally visible — sequential
  integer IDs invite enumeration and leak volume. Treat IDs as opaque strings on the client.
- **Enums over free text** for closed sets; document every value; tell clients to tolerate unknown
  values for forward-compat.
- **Nullability and absence:** be deliberate about `null` vs. omitted vs. empty — pick a rule
  (e.g. omit unknown, `null` for explicitly-cleared) and hold to it.
- **Booleans and units:** name the unit in the field (`timeout_seconds`, not `timeout`); avoid
  fields whose meaning depends on another field's value.

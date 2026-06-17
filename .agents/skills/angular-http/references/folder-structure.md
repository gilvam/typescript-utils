# Required inputs & folder contract

## Required inputs

Collect or infer before writing code:

- `serviceName`: kebab-case **domain/resource noun** of the integration, **without** the `http-`
  prefix (e.g. `weather`, `user-profile`, `billing`). It names *what* the API is about, not *how* it
  is reached — strip redundant transport/role words (see **Naming the service** below).
- Base URL / endpoint strategy already used by the project.
- For each endpoint: method name, HTTP verb, path, typed query params/body, a success JSON
  example, relevant error payloads, the response DTO name, and whether the response is a
  single object or an array.
- Any enums or domain-specific literal fields present in the JSON.

If an endpoint shape is missing, ask for the smallest concrete JSON example representing
success (and the relevant error payloads).

## Naming the service — strip redundant words

The `[service-name]` segment carries **only the domain/resource noun**. The surrounding context already
says it is an HTTP service: the folder is `services/http/`, the file is prefixed `http-` and suffixed
`.service.ts`, and the class is `Http[ServiceName]Service`. Repeating any of that inside the name is noise.

**Never** put these words in `[service-name]` (case-insensitive, as a standalone hyphen-delimited token):

- **Restates the HTTP/REST/API transport** — `api`, `web-api`/`webapi`, `rest`, `restful`, `endpoint`,
  `http`/`https`, `service`/`svc`, `client`, `web-service`/`webservice`/`ws`, `gateway`, `backend`,
  `integration`, `connector`, `proxy`, `remote`, `request`, `fetch`.
- **Generic / meaningless filler** — `util`/`utils`/`utility`, `helper`/`helpers`, `manager`, `handler`,
  `data`, `info`, `common`, `misc`, `wrapper`. (Angular's style guide explicitly says to *avoid generic
  names like `helpers.ts` or `utils.ts`* — a file name should reflect its real subject.)

This list is **not exhaustive** — reject *any* synonym that names the *mechanism* (transport, protocol,
layer, role) instead of the *subject*. When in doubt, keep the **shortest plain domain noun** that still
identifies the resource.

| Avoid                              | Use                        |
| ---------------------------------- | -------------------------- |
| `http-weather-api.service.ts`      | `http-weather.service.ts`  |
| `http-user-rest.service.ts`        | `http-user.service.ts`     |
| `http-billing-endpoint.service.ts` | `http-billing.service.ts`  |
| `http-payments-webapi.service.ts`  | `http-payments.service.ts` |
| `http-orders-service.service.ts`   | `http-orders.service.ts`   |
| `http-catalog-client.service.ts`   | `http-catalog.service.ts`  |
| `http-user-data.service.ts`        | `http-user.service.ts`     |

## Place the module closest to its consumer (`[host]`)

The HTTP module lives **as close as possible to the code that uses it.** Resolve `[host]` — the folder that
will contain the module's `services/http/` parent — from the service's *consumer scope*, not a fixed path.
**Never assume `src/app`.**

Two folders matter, and they are not always the same:

- **`[host]`** — where this module's `services/http/` goes: the nearest folder enclosing **every** consumer of
  the service (a single feature, or the app root).
- **`[app-root]`** — the application root that holds `app.config.ts`/`app.routes.ts`/`main.ts` and the shared
  `_decorators/` (default `src/app`). The `@Dto()` decorator always stays here, app-wide, regardless of
  where the module lands.

Resolve `[host]` in this order:

1. **Mirror an existing convention first.** Glob for `**/services/http/`. If HTTP modules already exist,
   follow that placement for consistency — unless the new service clearly belongs to a single feature that
   has (or should have) its own `services/http/`.
2. **One feature consumes it → co-locate inside that feature.** If exactly one feature uses the service, set
   `[host]` to that feature folder:
   `features/<feature>/services/http/http-[service-name]/`. This keeps the integration beside the pages and
   components that call it (the Angular "organize by feature / keep code close to where it's used" guidance).
3. **Several features or app-wide → app root.** If two or more features use it, or it is a cross-cutting
   client, set `[host]` = `[app-root]`: `[app-root]/services/http/http-[service-name]/`. Provide such
   services with `providedIn: 'root'` so a single instance crosses lazy-loaded boundaries.
4. **Single-service / tiny project (no feature folders) → app root.** With no feature structure, keep it at
   `[app-root]/services/http/`.

Promote a feature-scoped module up to `[app-root]` only when a **second** feature needs it — the same
"promote on second use" rule as the `angular-folder-structure` skill (sharing in anticipation is the
*Speculative Generality* smell). **State which `[host]` case applied** when you report back.

> `[host]` **defaults to `[app-root]`** (default `src/app`) whenever there is no clear single-feature owner —
> so a simple project still lands at `src/app/services/http/`.

## Folder contract

Create new modules **only** under `[host]/services/http/http-[service-name]/` (resolve `[host]` above):

```text
[host]/services/http/http-[service-name]/
├── http-[service-name].service.ts          # the real HttpClient service
├── http-[service-name].service.spec.ts     # service unit tests (HttpTestingController)
├── http-[service-name].mock.service.ts     # mock service for component/demo testing
├── models/
│   ├── [query-name].dto.ts                  # response/request DTOs (one concept per file)
│   ├── [nested-entity].dto.ts               # nested sub-DTOs
│   ├── [domain].enum.ts                      # enums / literal types for this module
│   └── [query-name].dto.spec.ts             # DTO null-safety specs
└── jsons/
    └── [method]/                            # one folder per service method (get, search, …)
        ├── 200-ok.json
        ├── 400-invalid-request.json
        └── 500-internal-server-error.json
```

Keep tests beside the code under test. Do not place integration DTOs in shared/global or
component folders unless the user explicitly asks for cross-module reuse. The `jsons/` fixtures
mirror the **real API responses**, keeping the original key casing (snake_case etc.) — they are
the input that proves the DTO mapping and the `keyCamelCase` conversion.

## Naming conventions

- `[service-name]`: **domain/resource noun only**, kebab-case — no redundant transport/role words
  (`api`, `rest`, `endpoint`, `webapi`, `service`, `client`, …) or generic filler (`util`, `helper`,
  `data`, …). See **Naming the service** above.
- Module folder: `http-[service-name]/`.
- Service: `http-[service-name].service.ts` → class `Http[ServiceName]Service`.
- Mock service: `http-[service-name].mock.service.ts` → class `Http[ServiceName]MockService`.
- DTO files: `[query-name].dto.ts` → class `[QueryName]Dto`.
- Enums: `[domain].enum.ts` → `[Domain]Enum`.

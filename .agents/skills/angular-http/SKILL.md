---
name: angular-http
description: Create standardized Angular HTTP integration modules in a services/http folder placed closest to its consumer — inside the owning feature (features/<feature>/services/http) when one feature uses it, or at the app root (default src/app/services/http) for app-wide or single-service projects — with typed HttpClient services, @Dto() DTOs with explicit create()/createArray() mapping (and the keyCamelCase option converting non-camelCase API keys such as snake_case to camelCase properties), a mock service, and unit tests. Pulls current Angular patterns via the context7 ctx7 CLI and guards the @Dto decorator dependency. Use when generating or standardizing Angular REST/HTTP queries, request/response DTOs, nested or non-camelCase API payload mapping, HTTP mocks, or service specs. Do not use for general component/template patterns (use angular-patterns) or application folder structure (use angular-folder-structure).
allowed-tools: Read, Grep, Glob, Write, Edit, Bash, WebFetch
---

# Angular HTTP — Structured HTTP Queries & Services

Use this skill to generate a complete, self-contained Angular HTTP module for an API
consultation. Keep **every** class, interface, enum, mock, helper, and spec that belongs to
the integration **inside the module folder** — nothing HTTP-related leaks into shared or
component folders.

Mirror the local example at `[app-root]/services/http/weather` for structure and style. The
example is illustrative only; where it diverges from the rules in this skill (it mixes a
legacy `search` flow with the newer `get` flow), **these rules win**.

## Companion skills

This skill **composes with** the base standards — it does not redefine them. When generating an HTTP module,
also apply these (each owns its own rules):

- **`typescript-patterns`** — base TypeScript standards (DTO classes, types, default values).
- **`code-standards-en`** — identifier naming, casing, function shaping.
- **`code-smell`** — refactoring catalogue for clean code.

(Component/template patterns belong to `angular-patterns`; folder layout to `angular-folder-structure`.)

## When to use this skill

Use it when you are asked to:

- Generate or standardize an Angular service for a REST/HTTP query.
- Model request/response payloads as DTOs with safe defaults and null-tolerance.
- Map nested API JSON (objects and arrays) into typed classes.
- Add HTTP mocks and unit tests for a service.

Do **not** use it for component/UI logic, state management, or non-HTTP services — use the **`angular-patterns`** skill for those.

## Recommended flow

1. **Consult current Angular patterns via context7** — see
   [references/context7-lookup.md](references/context7-lookup.md).
2. **Validate the `@Dto()` decorator** (vendor it only if missing) — see
   [references/decorator.md](references/decorator.md).
3. **Confirm the endpoint contracts, resolve a redundancy-free service name, and scaffold the folder** —
   see [references/folder-structure.md](references/folder-structure.md).
4. **Generate DTOs inside-out** (leaf DTOs first, then parents) — see
   [references/dto.md](references/dto.md).
5. **Add success + error mocks** under `jsons/[method]/`.
6. **Implement the service last** so every map calls the final DTO factory explicitly — see
   [references/service.md](references/service.md).
7. **Add the mock service** if consumers need it — see
   [references/mock-service.md](references/mock-service.md).
8. **Write and run the specs** (DTO null-safety + service HTTP testing) — see
   [references/testing.md](references/testing.md).

## Non-negotiable rules (summary)

- Every DTO has `@Dto()` and a safe default for **every** constructor field.
- API payloads with keys that are **not camelCase** (snake_case, PascalCase, kebab-case) →
  use `@Dto({ keyCamelCase: true })` **only on the root DTOs** whose `create()`/`createArray()`
  the `http-*` files call inside the RxJS `map` with the raw API response — the deep conversion
  already covers the nested DTOs, which keep the plain `@Dto()`. Class properties stay
  camelCase, and the `jsons/` fixtures keep the API's original casing. See
  [references/decorator.md](references/decorator.md) and [references/dto.md](references/dto.md).
- Nested objects/arrays are mapped **explicitly** with `Child.create(...)` /
  `Child.createArray(...)` — never rely on `@Dto()` alone for nested conversion.
- Services call `Dto.create(...)` / `Dto.createArray(...)` **explicitly** inside the RxJS
  `map`, even when the TypeScript type already looks compatible — with `keyCamelCase` this is
  also what triggers the key conversion (it runs only in the factories, not in `new`).
- New modules live in a `services/http/http-[service-name]/` folder placed **closest to its consumer**:
  inside the owning feature (`features/<feature>/services/http/…`) when a single feature uses it, otherwise at
  the app root (`[app-root]/services/http/…`, default `src/app`). Promote to the app root only on a **second**
  consumer. See [references/folder-structure.md](references/folder-structure.md).
- The `[service-name]` is the **domain/resource noun only** — never pad it with words that restate the
  HTTP/REST/API transport (`api`, `rest`, `endpoint`, `webapi`, `service`, `client`, `gateway`, …) or with
  generic filler (`util`, `helper`, `manager`, `data`, …). The `services/http/` folder, the `http-` prefix,
  the `.service.ts` suffix and the `Http…Service` class already convey all of that. See
  [references/folder-structure.md](references/folder-structure.md).

## References

- [context7-lookup.md](references/context7-lookup.md) — pull current Angular docs with `ctx7`.
- [decorator.md](references/decorator.md) — validate/vendor the `@Dto()` decorator.
- [folder-structure.md](references/folder-structure.md) — required inputs + folder contract.
- [dto.md](references/dto.md) — DTO rules, safe defaults, preferred shape.
- [service.md](references/service.md) — service rules and examples.
- [mock-service.md](references/mock-service.md) — mock service rules.
- [testing.md](references/testing.md) — DTO and service spec requirements.

## Avoid

- No Angular `NgModule` files for these HTTP modules.
- No HTTP DTOs in component or shared/global folders.
- Don't park a single-feature client at the app root — co-locate it with its feature; promote to the root
  only when a second feature consumes it.
- No raw API JSON returned from services.
- Never pad `[service-name]` with redundant transport/role words (`api`, `rest`, `endpoint`, `webapi`,
  `service`, `client`, `gateway`, …) or generic filler (`util`, `helper`, `manager`, `data`, …):
  `http-weather-api.service.ts` → `http-weather.service.ts`. See **Naming the service** in
  [references/folder-structure.md](references/folder-structure.md).
- Never skip `create()` / `createArray()` in services, even when the type looks compatible.
- Never lean on `@Dto()` for nested conversion — parents must call child factories.
- Never declare DTO properties in the API's casing (e.g. `first_name`) — enable
  `keyCamelCase` and keep the class camelCase.
- Don't spread `{ keyCamelCase: true }` across every `.dto.ts` — only the root DTOs whose
  factories the `http-*` files call with the raw API response need it.
- Never silently skip the context7 lookup — fall back to angular.dev and say so.

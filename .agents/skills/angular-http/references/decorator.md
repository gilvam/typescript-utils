# Validate the `@NoNull()` decorator

Every DTO depends on the `@NoNull()` decorator. Confirm it exists before generating DTOs.

Glob for the decorator anywhere in the project (e.g. `**/_decorators/class.decorator.ts`); it
conventionally lives at `[app-root]/_decorators/class.decorator.ts`.

- **If present** (the normal case): reuse it. The decorator stays **app-wide at `[app-root]/_decorators/`**,
  but the module may sit at any `[host]` (an owning feature, or the app root — see `folder-structure.md`), so
  **prefer the project's TS path alias** if one is configured (e.g. `import { NoNull } from '@decorators/class.decorator';`)
  — it survives wherever `[host]` lands. Otherwise **compute the import relative to the DTO's actual
  location**. For the app-root layout — a DTO at `[app-root]/services/http/http-[service-name]/models/` and the
  decorator at `[app-root]/_decorators/` — the import is:
  ```typescript
  import { NoNull } from '../../../../_decorators/class.decorator';
  ```
  That `../../../../` depth holds only for an app-root `[host]`. A **feature-scoped** module
  (`features/<feature>/services/http/http-[service-name]/models/`) is deeper, so recompute the relative path
  (it gains the feature segments) — or, better, use the path alias.

- **If missing**: vendor it before continuing. WebFetch the decorator source from
  `https://github.com/gilvam/typescript-utils/tree/main/src/decorators` (use the raw file
  URL) and Write it to `[app-root]/_decorators/class.decorator.ts`. Then proceed.

## What `@NoNull()` does (and does not) do

It converts `null` → `undefined` for **constructor arguments** and for the static
**`create`** / **`createArray`** arguments, which lets the TypeScript default parameter values
take over. As a result, `null`, `{}`, missing keys, and partial payloads all collapse to safe
defaults.

It does **not** recurse into nested objects or arrays. Parent DTOs must map their children
**explicitly** via `Child.create(...)` / `Child.createArray(...)` — see
[dto.md](dto.md).

## Reference

The decorator's behavior is covered by `[app-root]/_decorators/class.decorator.spec.ts`: it
verifies null→undefined for constructor args and for `create`/`createArray`, that other static
methods are untouched, and that the prototype chain / static properties are preserved.

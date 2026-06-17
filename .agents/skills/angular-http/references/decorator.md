# Validate the `@Dto()` decorator

Every DTO depends on the `@Dto()` decorator. Confirm it exists before generating DTOs.

Glob for the decorator anywhere in the project (e.g. `**/_decorators/class.decorator.ts`); it
conventionally lives at `[app-root]/_decorators/class.decorator.ts`.

- **If present** (the normal case): reuse it. The decorator stays **app-wide at `[app-root]/_decorators/`**,
  but the module may sit at any `[host]` (an owning feature, or the app root — see `folder-structure.md`), so
  **prefer the project's TS path alias** if one is configured (e.g. `import { Dto } from '@decorators/class.decorator';`)
  — it survives wherever `[host]` lands. Otherwise **compute the import relative to the DTO's actual
  location**. For the app-root layout — a DTO at `[app-root]/services/http/http-[service-name]/models/` and the
  decorator at `[app-root]/_decorators/` — the import is:
  ```typescript
  import { Dto } from '../../../../_decorators/class.decorator';
  ```
  That `../../../../` depth holds only for an app-root `[host]`. A **feature-scoped** module
  (`features/<feature>/services/http/http-[service-name]/models/`) is deeper, so recompute the relative path
  (it gains the feature segments) — or, better, use the path alias.

- **If missing**: vendor it before continuing. WebFetch the decorator source from
  `https://github.com/gilvam/typescript-utils/tree/main/src/decorators/class` (use the raw file
  URL) and Write it to `[app-root]/_decorators/class.decorator.ts`. Then proceed.

## What `@Dto()` does (and does not) do

The decorator normalizes the **constructor** arguments and the static **`create`** /
**`createArray`** arguments, driven by an options object:

| Option         | Default | Behavior                                                                                                                                                                                                  |
| -------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `noNullValue`  | `true`  | Converts `null` → `undefined` (shallow, at argument level) for the constructor **and** the factories, letting the TypeScript default parameter values take over — `null`, `{}`, missing keys, and partial payloads all collapse to safe defaults. |
| `keyCamelCase` | `false` | Recursively converts the keys of received objects to camelCase — nested objects and arrays included. Applied **only** to the static `create()` / `createArray()` arguments; a plain `new` receives the keys as-is.                                                          |

Enable `keyCamelCase` whenever the API payload uses keys that are **not camelCase**
(`first_name`, `UserData`, `user-id`, …) — but only on the **root DTOs** whose `create()` /
`createArray()` the `http-*` files call inside the RxJS `map` with the raw API response. The
conversion is deep, so nested DTOs receive already-camelCased objects and keep the plain
`@Dto()` — do not put the flag on every `.dto.ts`. Keep the DTO properties in camelCase —
never mirror the API's casing into the class. Because the conversion
runs **only in the factories**, raw API JSON must always enter through `create()` /
`createArray()` — never through `new` (which this skill already mandates for services). See
[dto.md](dto.md).

Null conversion is shallow, and the key conversion does **not** instantiate nested DTOs. Parent
DTOs must still map their children **explicitly** via `Child.create(...)` /
`Child.createArray(...)` — see [dto.md](dto.md).

## Reference

The decorator's behavior is covered by `[app-root]/_decorators/class.decorator.spec.ts`
(upstream:
`https://github.com/gilvam/typescript-utils/blob/main/src/decorators/class/class.decorator.spec.ts`):
it verifies null→undefined for constructor args and for `create`/`createArray`, the deep
key→camelCase conversion when `keyCamelCase: true` (and that keys pass through untouched when
it is off), that other static methods are untouched, and that the prototype chain / static
properties are preserved.

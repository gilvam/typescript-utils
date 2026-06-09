---
name: typescript-patterns
description: Apply this project's TypeScript house standards when writing or reviewing TypeScript — kebab-case filenames whose base matches the symbol, one declaration per file with a type suffix (.model.ts / .interface.ts / .enum.ts), classes for domain models instantiated with new (not object literals) and preferred over interfaces (reserving interfaces for implements contracts), default-initialized class fields ('' / 0 / false / first enum member / typed []), no optional (?) members for values we control, no any (prefer unknown plus a guard at boundaries), type annotations only when there is no initializer (empty [] excepted), interfaces using the `IName` prefix convention, enums for closed domain value sets, braces on every if, array iteration methods (map/filter/reduce/some/every/find/flatMap/…) over for/while loops, .at() over bracket indexing, component folder names echoed in inner files, and a unit test for every unit. Pulls current TypeScript guidance via the context7 ctx7 CLI. Use when authoring or reviewing TypeScript files, naming files/types, or modeling data. Defers identifier casing to code-standards-en, Angular folder layout to angular-folder-structure, and HTTP DTO modules to angular-http.
allowed-tools: Read, Grep, Glob, Write, Edit, Bash, WebFetch
---

# TypeScript Patterns — House Standards

Use this skill to write and review TypeScript that follows **this project's house standards**: one
well-named declaration per file, explicit class-based domain models, `I`-prefixed interfaces, enums for
closed value sets, and consistently structured control flow — every unit covered by a test.

These standards are deliberately opinionated. Where a rule diverges from idiomatic/community TypeScript, the
divergence is intentional and called out in the reference file so the choice is explicit, not accidental.
Confirm current TypeScript behavior via the **context7 `ctx7` CLI** before relying on version-specific
features — see [references/context7-lookup.md](references/context7-lookup.md).

## When to use this skill

Use it when you are asked to:

- Write a **new TypeScript file** (class, interface, enum, model) and want it to match house standards.
- **Review or refactor** TypeScript toward these conventions (naming, file structure, data modeling).
- Decide **how to name a file/type** or **how to model data** (class vs interface vs enum).

Do **not** redefine here (defer to the owning skill):

- **Identifier casing & function-shaping rules** (camelCase/PascalCase, verb-led names, CQS, sizing) — owned
  by **`code-standards-en`**.
- **Angular project/feature folder layout** — owned by **`angular-folder-structure`**.
- **Angular component/template/reactivity patterns** — owned by **`angular-patterns`**.
- **HTTP/REST DTO + service modules** — owned by **`angular-http`**.

## Recommended flow

1. **Consult current TypeScript docs** when a rule depends on version behavior — `ctx7` CLI. See
   [references/context7-lookup.md](references/context7-lookup.md).
2. **Detect the project's style** — read a few existing files first; if the codebase is consistent, mirror it
   and only standardize on explicit request.
3. **Name files & place declarations** — kebab-case, symbol-matched, one declaration per file with the right
   suffix. See [references/naming-and-files.md](references/naming-and-files.md).
4. **Model data** — classes for domain models, interfaces for contracts, enums for closed sets. See
   [references/classes.md](references/classes.md), [references/interfaces.md](references/interfaces.md),
   [references/enums.md](references/enums.md).
5. **Write structured control flow** — braces always; array iteration methods over loops. See
   [references/code-style.md](references/code-style.md).
6. **Add unit tests** for every new unit. See [references/testing.md](references/testing.md).
7. **Verify** — `tsc --noEmit` / lint pass; no `any`; tests present and green.

## Non-negotiable rules (summary)

- **kebab-case filenames.** Multi-word file names separate words with `-` (`user-default.model.ts`).
- **One declaration per file.** Exactly one class / interface / enum per file — no other top-level
  declarations (no stray variables, types, or extra classes alongside it).
- **Filename mirrors the symbol.** The file base (minus the `.suffix.ts`) is the kebab-case of the symbol:
  `user-default.model.ts` → `class UserDefault`; `user-generic.interface.ts` → `interface IUserGeneric`.
- **Type suffix per kind.** Class → `.model.ts`, interface → `.interface.ts`, enum → `.enum.ts`.
- **Classes for domain data; instantiate with `new`.** Prefer `new User('Jenifer', 'j@j.com')` over an object
  literal `{ name, email }`. Prefer classes/models/enums over bare `type` for domain modeling.
- **Classes over interfaces; reserve interfaces for `implements` contracts.** Model data as a class
  (`.model.ts`); use an `interface` mainly as the contract a class will `implement` — not as a plain data bag.
- **Default-initialize every class field.** `string → ''`, `number → 0`, `boolean → false`, enum → its first
  member, array → typed and `[]`. Required identity fields come via the constructor; an instance is never
  half-built.
- **No optional (`?`) members** on classes, interfaces, object shapes, or variables — give a default instead.
  *Only exception:* values outside our control (external libs / raw API payloads), where the absence is real.
- **No `any`.** Use a precise type; for values outside our control reach for **`unknown`** + a type guard.
  Keep `noImplicitAny` on.
- **Annotate only without an initializer.** Let inference type initialized bindings (`const total = 0`);
  annotate when there's no value — except an empty array, which is typed *and* assigned (`list: User[] = []`).
- **Interfaces are prefixed with `I`** (`IUserGeneric`). *House standard — note this diverges from the
  Google/Microsoft TS style guides, which advise against the `I` prefix; applied consistently here by choice.*
- **Enums for closed domain value sets** — never loose, untyped string arrays/magic strings.
- **Braces on every `if`** — never a single-line `if` without `{}`.
- **Array iteration methods over loop statements.** Use the array iteration methods (`map`, `filter`,
  `forEach`, `reduce`, `reduceRight`, `some`, `every`, `find`, `findIndex`, `findLast`, `findLastIndex`,
  `flatMap`, `flat`, and the iterator-producers `entries`/`keys`/`values` — full list in `code-style.md`) for
  collection work; avoid `for` / `while` / `do...while` for transforming, filtering, testing, or aggregating
  data. Loops (`for...of` / `for await...of`) are allowed **only** for sequential `await` or genuinely
  imperative side-effect flows.
- **`.at()` over bracket indexing.** Read elements with `array.at(i)` instead of `array[i]` — especially from
  the end (`array.at(-1)` rather than `array[array.length - 1]`); it returns `T | undefined` out of range.
- **Component folders echo their name.** In a component folder, inner files start with the folder name
  (`x-card/` → `x-card.component.ts`); a nested subfolder may extend it (`x-card/item/x-card-item.html`).
- **A unit test for every unit.** Always create the accompanying `.spec.ts` / test file.

## References

- [context7-lookup.md](references/context7-lookup.md) — confirm current TS behavior via `ctx7`.
- [naming-and-files.md](references/naming-and-files.md) — file naming, suffixes, one-per-file, folder echo.
- [classes.md](references/classes.md) — `.model.ts`, instances over literals, one class per file, default-
  initialized fields, no optional (`?`) members.
- [interfaces.md](references/interfaces.md) — `.interface.ts`, `I` prefix, filename rule, classes over
  interfaces (reserve interfaces for `implements`), no optional members.
- [enums.md](references/enums.md) — `.enum.ts`, closed sets, enum vs union literals.
- [code-style.md](references/code-style.md) — braces on control flow, the full array-iteration-method set
  over loops, `.at()` over bracket indexing, no `any` (use `unknown` at boundaries), and type annotations only
  without an initializer (defers the rest to `code-standards-en`).
- [testing.md](references/testing.md) — unit test per unit.

## Avoid

- Multi-word filenames not in kebab-case; filenames that don't match their symbol.
- Two top-level declarations in one file (a class plus a loose type/enum/const).
- Object literals for domain data where a class exists — use `new Class(...)`.
- Interfaces without the `I` prefix (house standard); enums replaced by magic strings.
- Interfaces as plain data bags — model data as a class; reserve interfaces for `implements` contracts.
- Optional (`?`) members or uninitialized fields for values we control — default them by type.
- `any` on our own code — use a precise type, or `unknown` + a guard for values outside our control.
- Redundant annotations on initialized bindings — annotate only without an initializer (empty `[]` excepted).
- Single-line `if` without braces.
- `for` / `while` / `do...while` for data processing — use array iteration methods; reserve `for...of` /
  `for await...of` for sequential `await` or imperative side-effects.
- `arr[arr.length - 1]` / from-the-end index arithmetic — use `arr.at(-1)`.
- New code without a unit test.
- Forcing these standards onto an existing codebase with a different, consistent convention — mirror it.
- Redefining casing/Angular/HTTP rules owned by the sibling skills.

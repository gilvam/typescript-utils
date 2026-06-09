# Classes & models

Domain data is modeled as **classes** in `.model.ts` files and created with `new` — not as anonymous object
literals. This is the house standard for a richer, behavior-carrying domain model; it is consistent with the
DTO-class approach in the `angular-http` skill.

## File & name

- File ends in **`.model.ts`**.
- Filename = kebab-case of the class name: `class UserDefault` → `user-default.model.ts`.

```ts
// user-default.model.ts
export class UserDefault {
  constructor(
    public name: string,
    public email: string,
  ) {}
}
```

## One class per file — nothing else top-level

Do **not** place variables, interfaces, enums, `type`s, or other classes alongside the class in the same
file. Each of those gets its own file (`*.interface.ts`, `*.enum.ts`, …). The only members are inside the
class itself.

```ts
// ❌ user-default.model.ts
export class UserDefault { /* ... */ }
export enum UserRole { Admin, Guest }     // → user-role.enum.ts
type UserId = string;                     // → its own file, or model as a class/field
```

## Prefer a class instance over an object literal

When a class exists for the concept, construct it — don't hand-build a matching object literal:

```ts
// ❌ bad — anonymous shape, no type identity, no invariants/behavior
const user = { name: 'Jenifer', email: 'j@j.com' };

// ✅ good — a real UserDefault instance
const user = new UserDefault('Jenifer', 'j@j.com');
```

Benefits: a single source of truth for the shape, runtime type identity (`instanceof`), a place to enforce
invariants and add behavior, and safer refactors.

> **Tradeoff (be aware):** idiomatic TypeScript often models plain data with `interface`/`type` and object
> literals, which are lighter and serialize trivially. The house standard accepts the extra ceremony of
> classes in exchange for behavior + invariants. Use classes for **domain models**; an `interface`
> (`*.interface.ts`) is still the right tool for a pure structural **contract** with no behavior.

## Prefer classes / models / enums over bare `type`

For domain concepts, reach for a **class** (data + behavior), an **interface** (contract), or an **enum**
(closed set) before a bare `type` alias. Keep `type` for what only `type` can express — unions, tuples,
mapped/conditional types, and aliases of primitives.

## No optional (`?`) members — model presence explicitly

Don't mark class fields optional with `?`. An optional member widens the type to `T | undefined` (the TS
handbook treats optional members as nullable under `strictNullChecks`), which forces a guard at every read
and lets a half-built instance exist. Give the field a real default instead (see below) so the type stays
non-nullable. The same rule applies to interface members, object shapes, and variables.

```ts
// ❌ optional — type is `string | undefined`, every reader must guard
export class UserDefault {
  name?: string;
}

// ✅ required with a safe default — type stays `string`
export class UserDefault {
  name: string = '';
}
```

**Only exception — values outside our control.** When a value genuinely originates outside our code (an
external library type, or a raw API payload that may legitimately omit the field), `?` / `| undefined` is
acceptable because the absence is real. For HTTP/DTO payloads, prefer the `@NoNull()` + safe-default
approach in the **`angular-http`** skill over leaking `?` into the domain.

## Initialize every field with a safe default

Every class field starts in a valid state — this satisfies `strictPropertyInitialization` and keeps the
field non-optional (above). Required identity fields come through the constructor; everything else is
initialized at the declaration, by type:

| Field type | Default |
| --- | --- |
| `string` | `''` |
| `number` | `0` |
| `boolean` | `false` |
| enum | the **first** member of the enum |
| array | typed and `[]` (see the annotation rule in `code-style.md`) |
| nested model | a `new Child()` / the right factory |

```ts
// user-default.model.ts
export class UserDefault {
  name: string = '';
  age: number = 0;
  role: UserRole = UserRole.Admin;   // first enum member
  tags: string[] = [];               // typed + []
}
```

So an instance is never half-initialized: no field is `undefined` unless its value is genuinely outside our
control (see the exception above).

## Avoid

- Object literals for a concept that has a `.model.ts` class.
- Extra top-level declarations sharing the class's file.
- A bare `type` where a class/interface/enum models the concept better.
- Optional (`?`) fields for values we control — give the field a default instead.
- Leaving a field uninitialized (half-built instance) — default it by type (`''` / `0` / `false` / first enum
  member / typed `[]`).

# Naming & files

Identifier casing (camelCase/PascalCase) and the general "kebab-case files mirroring symbols" rule come from
the **`code-standards-en`** skill. This file adds the TypeScript-specific **file-per-declaration**, **type
suffix**, and **component folder echo** rules.

## kebab-case filenames

Any file whose name has more than one word separates them with hyphens:

```
user-default.model.ts      ✅
userDefault.model.ts       ❌ (camelCase file)
user_default.model.ts      ❌ (snake_case file)
```

## One declaration per file

Each file contains **exactly one** top-level declaration — one class, one interface, or one enum — and
**nothing else** at the top level (no stray variables, `type`s, helper functions, or extra classes).

```ts
// ✅ user-default.model.ts — only the class
export class UserDefault { /* ... */ }

// ❌ same file mixing concerns
export class UserDefault { /* ... */ }
export interface IUserOptions { /* ... */ }   // → user-options.interface.ts
export const DEFAULT_ROLE = 'guest';          // → its own module / a class member
```

Why: keeps each concept independently discoverable, testable, and diff-friendly. (This is stricter than
idiomatic TS, which allows co-located small types — it is a deliberate house rule.)

## Filename mirrors the symbol + type suffix

The file base — everything before the `.suffix.ts` — is the **kebab-case of the symbol name**, and the suffix
encodes the kind:

| Kind | Suffix | Symbol → file |
| --- | --- | --- |
| Class (domain model) | `.model.ts` | `class UserDefault` → `user-default.model.ts` |
| Interface | `.interface.ts` | `interface IUserGeneric` → `user-generic.interface.ts` (drops the `I`) |
| Enum | `.enum.ts` | `enum OrderStatus` → `order-status.enum.ts` |

- For interfaces, the **`I` prefix is part of the symbol but not the filename**: `IUserGeneric` →
  `user-generic.interface.ts` (see `interfaces.md`).
- The base must round-trip: read the filename → you know the exact symbol inside it.

## Component folders echo their name

Inside a component folder, every inner file **starts with the folder name**:

```
x-card/
├─ x-card.component.ts
├─ x-card.html
├─ x-card.css
└─ x-card.spec.ts
```

A nested subfolder **extends** the name with its own segment:

```
x-card/
├─ x-card.component.ts
└─ item/
   ├─ x-card-item.component.ts
   ├─ x-card-item.html
   └─ x-card-item.css
```

So `x-card/item/x-card-item.html` is correct — the path's folder names compose the file prefix. (Angular
component/feature layout itself is owned by `angular-folder-structure`; this rule only governs the file-name
echo within a component folder.)

## Avoid

- camelCase/snake_case multi-word filenames.
- More than one top-level declaration per file.
- A filename whose base doesn't match the symbol (or a missing/incorrect type suffix).
- Inner component files that don't start with their folder's name.

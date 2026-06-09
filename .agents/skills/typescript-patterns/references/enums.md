# Enums

Represent a **closed set of domain values** with an `enum` — never loose, untyped string arrays or scattered
magic strings.

## File & name

- File ends in **`.enum.ts`**.
- Filename = kebab-case of the enum name: `enum OrderStatus` → `order-status.enum.ts`.

```ts
// order-status.enum.ts
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}
```

- Prefer **string-valued** enums (as above) over default numeric enums — the values are self-describing in
  logs, payloads, and debugging.

## Why a closed type, not loose strings

```ts
// ❌ loose, untyped — no autocomplete, typos compile, no exhaustiveness
const statuses = ['PENDING', 'PAID', 'SHIPPED'];
function setStatus(s: string) { /* anything goes */ }

// ✅ closed domain set
function setStatus(s: OrderStatus) { /* only valid members */ }
```

A closed type gives autocomplete, catches typos at compile time, and enables exhaustive `switch` checks.

## Accepted equivalent: union string literals / `as const`

Modern TypeScript often models closed sets with a **union of string literal types** or an `as const` object
instead of `enum`. These are accepted here as equivalents when an `enum`'s runtime object isn't needed — the
non-negotiable part is *"a closed type, never loose strings."*

```ts
// union literal — purely structural, zero runtime emit
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';

// as const object — values + a derived union type
export const ORDER_STATUS = {
  Pending: 'PENDING',
  Paid: 'PAID',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
```

Pick `enum` (house default) when you want a named runtime object to iterate/reference; pick a union/`as const`
when you want zero runtime footprint. Either way, keep it in its own `*.enum.ts` (or `*.type.ts` for a pure
union) file.

## Avoid

- Bare string arrays / magic strings for a fixed domain set.
- `const enum` in projects using `isolatedModules`/Babel (it doesn't emit reliably there).
- More than one enum per file, or mixing an enum into a class/interface file.

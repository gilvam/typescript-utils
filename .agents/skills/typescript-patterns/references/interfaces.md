# Interfaces

Interfaces describe **contracts / structural shapes** with no behavior. (For data that carries behavior or
invariants, use a class `.model.ts` instead — see `classes.md`.)

## File & name

- File ends in **`.interface.ts`**.
- The interface name is **prefixed with `I`**.
- The **filename drops the `I`** and kebab-cases the rest:

```
interface IUserGeneric   →   user-generic.interface.ts
interface IOrderRepository →  order-repository.interface.ts
```

```ts
// user-generic.interface.ts
export interface IUserGeneric {
  id: string;
  name: string;
}
```

> **House standard, stated explicitly:** the `I` prefix **diverges from the Google and Microsoft TypeScript
> style guides**, which recommend *no* prefix (TypeScript is structurally typed, so the marker is redundant).
> This project keeps the `I` prefix on purpose for at-a-glance contract recognition — apply it **consistently**
> to every interface. If you ever standardize the codebase away from it, drop the prefix everywhere at once;
> never mix `IUser` and `User` interfaces.

## Prefer a class — reserve interfaces for `implements` contracts

House standard: model concepts as **classes** by default. Reach for an `interface` mainly when it's the
contract a class will `implement` — that's the case a class can't replace. For plain data, use a class
`.model.ts` with safe defaults (see `classes.md`) instead of an interface, so you get a real instance,
default values, and `instanceof`.

```ts
// ✅ interface as an implementable contract — the kept use case
export interface IUserRepository {
  findById(id: string): UserDefault;
}

export class UserRepository implements IUserRepository {
  findById(id: string): UserDefault { /* ... */ }
}

// ❌ interface as a plain data bag — model it as a class instead
export interface IUser {
  id: string;
  name: string;
}
```

## No optional (`?`) members

As in classes, don't mark interface members optional with `?` — it widens the member to `T | undefined` and
pushes a guard onto every consumer. Declare it required. **Only exception:** the shape describes data
outside our control (an external library type, or a raw API payload that may legitimately omit it).

## When to use an interface vs a class vs a type

- **Interface (`I…`, `*.interface.ts`)** — primarily the public API a class must `implement`
  (`class UserRepo implements IUserRepository`); don't use it as a plain data bag (model that as a class). No
  runtime footprint.
- **Class (`*.model.ts`)** — domain data with behavior/invariants, instantiated with `new` (see `classes.md`).
- **`type`** — only for what interfaces can't express: unions, tuples, mapped/conditional types, primitive
  aliases.

The TypeScript handbook notes interfaces and intersections extend more efficiently for the compiler than
`type` intersections — another reason to prefer an interface for a contract a class implements.

## Avoid

- Interfaces without the `I` prefix (house standard).
- Keeping the `I` in the **filename** (`iuser-generic.interface.ts` ❌ → `user-generic.interface.ts`).
- More than one interface per file, or mixing an interface into a class/enum file.
- Using an interface where the concept needs behavior — model it as a class instead.
- An interface as a plain data bag — reserve interfaces for `implements` contracts; model data as a class.
- Optional (`?`) members for data we control — declare them required.

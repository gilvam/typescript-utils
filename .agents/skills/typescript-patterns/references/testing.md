# Testing — a unit test for every unit

Every new unit (class/model, pure function, meaningful module) ships with an accompanying **unit test**. Tests
are not optional follow-up work — they are part of "done".

## File & placement

- Co-locate the spec beside the unit, sharing the base name: `user-default.model.ts` →
  `user-default.model.spec.ts`.
- Keep the spec's filename in kebab-case, matching the unit (see `naming-and-files.md`).

```
user-default/
├─ user-default.model.ts
└─ user-default.model.spec.ts
```

## What to cover

- **Construction / invariants** — a class built with `new` has the expected state and rejects invalid input.
- **Behavior** — each public method's happy path plus its meaningful edge cases.
- **Branches** — both sides of significant conditionals (the braced `if`/`else` paths).
- **Closed sets** — enum/union-driven `switch` logic is exhaustive.

```ts
// user-default.model.spec.ts
import { UserDefault } from './user-default.model';

describe('UserDefault', () => {
  it('exposes the values it was constructed with', () => {
    const user = new UserDefault('Jenifer', 'j@j.com');

    expect(user.name).toBe('Jenifer');
    expect(user.email).toBe('j@j.com');
  });
});
```

## Rules

- **No new unit without a test.** If a unit is hard to test, that is a design signal — simplify it.
- One concept under test per spec file, mirroring the one-declaration-per-file rule.
- Use the project's existing runner/conventions (Jest, Vitest, Karma/Jasmine) — detect and match before
  introducing a new one. For Vitest specifics, see the `vitest-testing` skill if present.

## Avoid

- Shipping a class/function/model without its `*.spec.ts`.
- A spec that only constructs the unit without asserting behavior.

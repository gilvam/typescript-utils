# Code style — control flow, iteration & type usage

Statement-level style (verb-led names, early returns, no boolean-flag params, CQS, method/class sizing, one
binding per statement, minimal comments) is owned by the **`code-standards-en`** skill. This file pins the
house-standard rules called out explicitly: **braces on control flow**, **array iteration methods over loop
statements**, **`.at()` over bracket indexing**, **no `any` (use `unknown` at boundaries)**, and **type
annotations only when there's no initializer**.

## Always use braces on `if` — never a single-line `if`

Every `if` (and `else`, `for`, `while`) uses a braced block on its own lines, even for a single statement.

```ts
// ✅ good
if (user.isActive) {
  notify(user);
}

// ❌ bad — single-line / brace-less
if (user.isActive) notify(user);
if (user.isActive) { notify(user); }
```

Why: a braced block prevents the classic "second statement silently outside the `if`" bug, keeps diffs clean
when a branch grows, and reads consistently. This matches the Google TypeScript Style Guide, which requires
braces for all control-flow statements.

The same applies to `else` / `else if`, and to the loop forms that remain allowed (see the iteration rule
below):

```ts
// ✅
if (isPaid) {
  ship();
} else {
  hold();
}

// allowed loop: sequential await (see "Array iteration methods" below)
for (const id of orderIds) {
  await fulfil(id);
}
```

> Guarded **early returns** (preferring them over deep `if/else` nesting) are governed by `code-standards-en`
> — they still use braces.

## Prefer array iteration methods over loop statements

Default to **array iteration methods** for working with collections. Avoid `for`, `while`, and `do...while`
for data processing — the declarative form states *intent* (transform / filter / test / aggregate) and is
well-typed (TS 5.5+ even infers type predicates through `.filter`). The full set is listed below; reach for
the one that names your intent.

```ts
// ❌ imperative loop with a manual accumulator
function activeNamesImperative(users: User[]): string[] {
  const names: string[] = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      names.push(users[i].name);
    }
  }
  return names;
}

// ✅ declarative pipeline
function activeNames(users: User[]): string[] {
  return users.filter((user) => user.active).map((user) => user.name);
}
```

Pick the method that names the intent. **Callback iteration methods:**

| Intent | Method |
| --- | --- |
| Transform each element into a new array | `map` |
| Keep only the elements that match | `filter` |
| Run a side effect per element (no async) | `forEach` |
| Aggregate to a single value, left → right | `reduce` |
| Aggregate to a single value, right → left | `reduceRight` |
| Is **any** element a match? (short-circuits) | `some` |
| Do **all** elements match? (short-circuits) | `every` |
| First matching **element** | `find` |
| Index of the first match | `findIndex` |
| Last matching **element** | `findLast` |
| Index of the last match | `findLastIndex` |
| Map each element, then flatten one level | `flatMap` |
| Flatten nested arrays (no callback) | `flat` |

**Iterator-producing methods** — pair these with `for...of`, spread, or destructuring when you need indices
alongside values:

| Intent | Method |
| --- | --- |
| `[index, value]` pairs | `entries` |
| Indices only | `keys` |
| Values only (default iterator) | `values` |

> Prefer the **non-mutating** copying variants over their in-place counterparts when you need a changed copy:
> `toSorted` / `toReversed` / `toSpliced` / `with` instead of `sort` / `reverse` / `splice` / index assignment.

### Allowed exceptions — when a loop is correct

Use `for...of` / `for await...of` (with braces) only in these cases; never a manual-index `for`/`while` for
plain data processing:

- **Sequential `await`.** Array methods can't await in sequence — `arr.forEach(async …)` fires every promise
  at once and ignores them. Iterate with `for...of` / `for await...of` when each step must finish before the
  next:

  ```ts
  // ✅ sequential — each fulfil() completes before the next
  for (const id of orderIds) {
    await fulfil(id);
  }

  // ✅ independent work in parallel — prefer this when order doesn't matter
  await Promise.all(orderIds.map((id) => fulfil(id)));
  ```

- **Genuinely imperative side-effect flows** that don't map cleanly (e.g. complex `break`/`continue` logic).
  Even then, prefer `for...of` over `.forEach` so you keep `await`/`break`/`continue` and clean stack traces.

## Prefer `.at()` over bracket indexing

Read an element by position with `array.at(i)` rather than `array[i]` — most importantly for access **from the
end**, where `.at()` takes a negative index and removes the `length` arithmetic:

```ts
// ❌ index arithmetic from the end
const last = items[items.length - 1];
const secondLast = items[items.length - 2];

// ✅ at() with a negative index
const last = items.at(-1);
const secondLast = items.at(-2);
```

- `at()` accepts **negative** indices (counting back from the end) and returns `undefined` when out of range
  — the same `T | undefined` you get under `noUncheckedIndexedAccess`, so handle the empty/missing case.
- Works on arrays, typed arrays, and strings (and any array-like via `Array.prototype.at.call`).
- It replaces **positional element access only** — it is not a substitute for object property access, and
  array destructuring (`const [first] = items`) is still fine for leading elements.

## Avoid `any` — reach for `unknown` at the boundary

`any` switches off type checking for everything it touches, so a typo or wrong shape passes silently. Never
annotate our own code with `any`, and keep `noImplicitAny` on so the compiler flags inferred `any` (an
un-annotated parameter, a bare `[]` that infers `any[]`, etc.).

**Only exception — values outside our control.** When a value genuinely comes from outside our code (an
untyped external library, `JSON.parse`, a raw API payload), use **`unknown`**, not `any`, and narrow it with
a type guard before use — this is the TypeScript handbook's own *Do's and Don'ts* guidance.

```ts
// ❌ any — no checking; `data.naem` would not error
function handle(data: any) { /* ... */ }

// ✅ unknown at the boundary, then narrow
function handle(data: unknown) {
  if (data instanceof UserDefault) {
    // data is UserDefault here
  }
}
```

## Annotate a variable only when there's no initializer

Let inference do the work: when you assign an initial value, **don't** add a redundant type annotation — the
value already fixes the type. Add an explicit annotation only when there's no initializer (otherwise the
binding has nothing to infer from and falls back to `any` under loose settings).

```ts
// ❌ redundant annotation — the value already fixes the type
const name: string = '';
const total: number = 0;

// ✅ inferred from the value
const name = '';
const total = 0;

// ✅ no initializer → annotate (assigned later)
let selected: UserDefault;
```

**Array exception — type *and* assign for an empty `[]`.** An empty array literal infers `never[]` / `any[]`,
so an empty-array initializer is the one case where you both annotate and assign:

```ts
// ❌ infers any[] / never[] — loses the element type
private list = [];

// ✅ typed and initialized
private list: UserDefault[] = [];
```

> Grouping/placement of declarations (one binding per statement, declared adjacent to first use) is owned by
> the **`code-standards-en`** skill — this rule only governs *when the type annotation is redundant*.

## Avoid

- Brace-less single-statement `if`/`else`/`for`/`while`.
- Putting the body on the same line as the condition.
- `for` / `while` / `do...while` (especially manual-index loops) for transforming, filtering, testing, or
  aggregating data — use the array method that names the intent.
- `arr.forEach(async …)` / `arr.map(async …)` when steps must run **in sequence** — use `for...of` /
  `for await...of`; use `Promise.all(arr.map(…))` only when the work is independent.
- `arr[arr.length - 1]` (or other from-the-end index arithmetic) — use `arr.at(-1)`.
- Mutating in place (`sort` / `reverse` / `splice`) when a copy is wanted — use `toSorted` / `toReversed` /
  `toSpliced` / `with`.
- `any` on our own code — use a precise type, or `unknown` + a guard for values outside our control.
- Redundant type annotations on initialized bindings (`const n: number = 0`) — let inference work; annotate
  only when there's no initializer (the empty-array `[]` case excepted).

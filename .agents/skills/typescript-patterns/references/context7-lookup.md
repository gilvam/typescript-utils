# Consult current TypeScript behavior via context7 (`ctx7`)

These house standards are about *structure and naming* and rarely depend on the compiler version. But when a
rule touches version-specific behavior (e.g. `enum` emit vs `as const`, `satisfies`, `const` type
parameters), confirm it with the context7 CLI before relying on it — do not assert from memory.

```bash
# 1. Resolve the library id (always run this first)
npx ctx7@latest library typescript "TypeScript naming conventions, interface vs type, enums vs unions"

# 2. Query the docs with the id returned above (currently /microsoft/typescript-website)
npx ctx7@latest docs /microsoft/typescript-website "Interface vs type alias guidance and object shape modeling"
npx ctx7@latest docs /microsoft/typescript-website "Enums vs union of string literal types and const assertions"
```

Use whatever id Step 1 reports — do not hardcode it. The TypeScript handbook entry currently resolves to
`/microsoft/typescript-website` (the docs/handbook), with `/microsoft/typescript` (the compiler repo) and
`/websites/typescriptlang` as alternates.

## Rules

- Run `ctx7 library` before `ctx7 docs` unless an id in `/org/project` form is already known.
- Use specific, full-sentence queries — not single words.
- Cap at **3** `ctx7` calls per task. On a quota error, tell the user context7 is unavailable and fall back to
  the links below (do not silently skip the lookup).

## What current TypeScript guidance says (and how these standards relate)

The house standards intentionally override some community defaults — these are the deltas to be aware of:

- **interface vs type:** the handbook recommends `interface` for plain object shapes until you need
  `type`-only features (unions, tuples, mapped types). *Here* domain data is modeled as **classes**
  (`.model.ts`), with interfaces used for contracts — a deliberate, richer-domain choice (see `classes.md`).
- **`I` prefix:** Google/Microsoft TS style guides advise *against* prefixing interfaces with `I`. *Here* the
  `I` prefix is the house standard, applied consistently (see `interfaces.md`).
- **enums:** modern TS often prefers union string literals or `as const` objects over `enum`. *Here* `enum`
  is the default for closed domain sets, with unions accepted as an equivalent (see `enums.md`).

## Fallback / reference docs

- Everyday types (interfaces & type aliases): https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- Enums: https://www.typescriptlang.org/docs/handbook/enums.html
- Google TypeScript Style Guide: https://google.github.io/styleguide/tsguide.html

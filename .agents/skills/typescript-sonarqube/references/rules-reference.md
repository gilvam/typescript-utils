# SonarJS rule reference (TypeScript)

Verified SonarJS rule keys, grouped by issue type. These are the ones developers hit most in
TypeScript codebases. When running via `eslint-plugin-sonarjs`, each maps to an ESLint rule id
shown in the last column. Authoritative list: https://rules.sonarsource.com/typescript/

> Don't cite a key that isn't here without verifying it on rules.sonarsource.com first.

## Bugs (Reliability)

| Key | Name | What it catches | ESLint id |
|---|---|---|---|
| S3923 | all branches identical | every branch of an `if/else` or `switch` does the same thing | `no-all-duplicated-branches` |
| S1862 | identical conditions | sibling `if/else if` conditions are identical (later ones are dead) | `no-identical-conditions` |
| S3403 | strict-eq different types | `===` / `!==` between values of incompatible types is always false | `different-types-comparison` |
| S2201 | return value ignored | result of a pure/important function is discarded | `no-ignored-return` |
| S2189 | infinite loop | loop with no reachable exit condition | `no-infinite-loop` |
| S5843 | redundant assignment | a variable is reassigned with the value it already holds | `no-redundant-assignments` |
| S3923 / S1764 | identical operands | both sides of a binary operator are identical (`a && a`) | `no-identical-expressions` |
| S2757 | suspicious `=+` | `=+`/`=-` where `+=`/`-=` was meant | `non-existent-operator` |
| S930 | wrong arg count | function called with the wrong number of arguments | `arguments-usage` |

## Code Smells (Maintainability)

| Key | Name | What it catches | ESLint id |
|---|---|---|---|
| S3776 | cognitive complexity | function too branchy/nested (default threshold **15**) — extract | `cognitive-complexity` |
| S1192 | duplicated string | same string literal 3+ times — hoist to a constant | `no-duplicate-string` |
| S4144 | identical functions | two functions/methods share an implementation — reuse one | `no-identical-functions` |
| S2589 | gratuitous boolean | expression is always true/false (redundant null/condition check) | `no-gratuitous-expressions` |
| S1066 | collapsible if | nested `if` that merges into the parent with `&&` | `no-collapsible-if` |
| S1125 | redundant boolean | `x === true`, `cond ? true : false` | `no-redundant-boolean` |
| S1854 | dead store | a value assigned is overwritten before being read | `no-dead-store` |
| S125 | commented-out code | blocks of code left as comments — delete | `no-commented-code` |
| S1488 | immediate return | local declared only to be returned on the next line | `prefer-immediate-return` |
| S6606 | prefer `??` | `||` used to guard null/undefined instead of `??` | `prefer-nullish-coalescing` |
| S6571 | redundant union member | a union member subsumed by another (`any`/`unknown` overlap) | `no-redundant-type-constituents` |
| S4325 | unnecessary assertion | `as`/`!` that the type already guarantees | `no-unnecessary-type-assertion` |
| S4623 | redundant `undefined` arg | passing `undefined` for an optional trailing parameter | `no-redundant-optional` |
| S1186 | empty function | function body is empty with no explanation | `no-empty-function` |
| S3735 | `void` misuse | the `void` operator used in a confusing way | `void-use` |
| S6594 | prefer `.exec()` | use `RegExp.exec()` over `String.match()` in a loop | `prefer-regexp-exec` |

## How to apply during review
1. Read the target files.
2. For each function, eyeball **S3776**: count `if/for/while/catch/&&/||/?:` and nesting depth;
   flag anything visibly past ~15 and propose an extraction.
3. Scan for repeated string literals (**S1192**) and twin method bodies (**S4144**) — the two
   most common real findings in this repo's `src/decorators/`.
4. Map each finding to the exact key above; never approximate.

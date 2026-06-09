---
name: angular-patterns
description: Apply current Angular best practices when writing or reviewing component, template, reactivity, and form code — standalone components split into separate .ts/.html/.css files, signals for state with RxJS for streams (async/await only for one-shot promises), OnPush/zoneless change detection, native control flow (@if/@for/@switch), inject(), host bindings, class/style bindings over NgClass/NgStyle, and typed reactive forms. Pulls current Angular patterns via the Angular CLI MCP (get_best_practices) with the context7 ctx7 CLI as fallback. Use when authoring or reviewing Angular components, templates, state/reactivity, or forms. Do not use for folder layout (use angular-folder-structure) or HTTP service modules (use angular-http).
allowed-tools: Read, Grep, Glob, Write, Edit, Bash, WebFetch
---

# Angular Patterns — Component, Reactivity & Template Best Practices

Use this skill to write and review **idiomatic, current-generation Angular** code: standalone
components, **signals-first** state, native control flow, and typed reactive forms. It encodes the
conventions the Angular team recommends today (v17–20) so generated code stays modern and consistent.

Ground every decision in current Angular docs: consult the **Angular CLI MCP** (`get_best_practices`)
first, fall back to the **context7 `ctx7` CLI**, then to **angular.dev** — never assert a pattern from
memory alone. See [references/mcp-lookup.md](references/mcp-lookup.md).

## Companion skills

This skill **composes with** the base standards — it does not redefine them. When writing Angular code, also
apply these (each owns its own rules):

- **`typescript-patterns`** — base TypeScript standards (classes, interfaces, types, default values).
- **`code-standards-en`** — identifier naming, casing, function shaping.
- **`code-smell`** — refactoring catalogue for clean code.

(HTTP/DTO modules belong to `angular-http`; folder layout to `angular-folder-structure`.)

## When to use this skill

Use it when you are asked to:

- Write a **new component, directive, or pipe** and want it to follow modern Angular.
- **Review or refactor** existing component/template/state/form code toward current best practices.
- Decide **how to model state** (signals vs RxJS vs plain async/await).
- Choose **template constructs** (native control flow, class/style bindings, host bindings).
- Build a **form** (reactive, typed) the recommended way.

Do **not** use this skill for:

- Project/feature **folder layout** — use the **`angular-folder-structure`** skill.
- **HTTP/REST integration** modules (typed `HttpClient` services, DTOs, mocks) — use **`angular-http`**.

## Recommended flow

1. **Consult current Angular patterns** — Angular CLI MCP first, `ctx7` fallback, angular.dev last. See
   [references/mcp-lookup.md](references/mcp-lookup.md).
2. **Detect the project's conventions** — read a few existing components first; if the app has a consistent
   style, mirror it and only modernize on explicit request.
3. **Apply the component patterns** — standalone, separate files, OnPush, `inject()`. See
   [references/component-patterns.md](references/component-patterns.md).
4. **Model reactivity correctly** — signals for state, RxJS for streams, async/await for one-shot. See
   [references/reactivity.md](references/reactivity.md).
5. **Write modern templates** — native control flow + class/style bindings. See
   [references/templates.md](references/templates.md).
6. **Build typed reactive forms** when forms are involved. See [references/forms.md](references/forms.md).
7. **Verify** — `ng build` / `ng lint` pass; no `any`; no legacy `*ngIf`/`*ngFor`/`NgModule`.

## Non-negotiable rules (summary)

- **Three separate files per component** — keep `templateUrl` (`.html`) and `styleUrl` (`.css`) external,
  not inline. This is Angular's CLI default and the documented "organized/maintainable" choice. *Exception:*
  a trivial component (a few lines of template, no styles) may inline — but default to separate files.
- **Signals for state, RxJS for streams, async/await for one-shot.** Use `signal`/`computed` for component
  state; use RxJS when you need cancellation, operators (`switchMap`, `debounceTime`, retries), or to combine
  streams; bridge to templates with `toSignal()` or the `async` pipe. Plain `async/await` is fine only for a
  simple one-shot promise — **not** for ongoing streams that need cancellation or operators.
- **Standalone-first** — no `NgModule` files unless the project already uses them.
- **OnPush (or zoneless) change detection** on every component.
- **Native control flow** (`@if` / `@for` / `@switch`), never the legacy `*ngIf` / `*ngFor` / `*ngSwitch`.
- **`inject()`** over constructor parameter injection for new code.
- **`class` / `style` bindings** over `NgClass` / `NgStyle`; **host bindings** in the `@Component({ host })`
  object over `@HostBinding` / `@HostListener`.
- **Typed reactive forms** over template-driven forms for non-trivial forms.
- **No `any`.** Type inputs/outputs and state explicitly; prefer `input()` / `output()` / `model()` signals.
- **Mirror an existing app's convention** when one exists; modernize only greenfield or on explicit request.

## References

- [mcp-lookup.md](references/mcp-lookup.md) — pull current Angular docs via Angular CLI MCP / `ctx7` / angular.dev.
- [component-patterns.md](references/component-patterns.md) — standalone, separate files, OnPush, `inject()`, host.
- [reactivity.md](references/reactivity.md) — signals vs RxJS vs async/await; `toSignal` / `async` pipe.
- [templates.md](references/templates.md) — native control flow + class/style bindings + `NgOptimizedImage`.
- [forms.md](references/forms.md) — typed reactive forms.

## Avoid

- No inline `template` / `styles` for non-trivial components — split into `.html` / `.css`.
- No `async/await` for continuous streams that need cancellation or operators — use RxJS.
- No legacy `*ngIf` / `*ngFor` / `*ngSwitch`, no `NgClass` / `NgStyle`, no `NgModule` in new code.
- No constructor injection in new code — use `inject()`.
- No `any`; no untyped forms; no `FormGroup` without a typed model for non-trivial forms.
- Never force these patterns onto an existing app with a different, consistent convention — mirror it.
- Never silently skip the docs lookup — say which source you used (Angular MCP, `ctx7`, or angular.dev).

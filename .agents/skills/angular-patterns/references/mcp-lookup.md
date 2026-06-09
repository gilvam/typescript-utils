# Consult current Angular patterns (Angular CLI MCP → `ctx7` → angular.dev)

Before writing or reviewing component/template/reactivity/form code, confirm the **current** Angular
conventions so the code matches the installed Angular version. Use the sources in this order and **state
which one you used** — never silently fall back to memory.

## 1. Primary — Angular CLI MCP Server

The official Angular CLI MCP Server ships with `@angular/cli` (v20.2+) and is configured in the target
project's `.vscode/mcp.json` (or `.cursor/mcp.json`). When it is wired, prefer its tools:

- **`get_best_practices`** — the Angular Best Practices Guide (standalone, signals, OnPush, native control
  flow, typed forms). This is the canonical source for everything this skill enforces.
- **`search_documentation`** — query angular.dev (e.g. "signals and computed", "toSignal rxjs-interop",
  "native control flow @if @for", "typed reactive forms").
- **`find_examples`** — pull example components and form setups.

Use specific, full-sentence queries, not single words.

> The MCP may not be wired in every environment. If its tools are unavailable, move to `ctx7`.

## 2. Fallback — context7 `ctx7` CLI

Same pattern the `angular-http`, `angular-folder-structure`, and `context7` skills use. Resolve the library
id first, then query docs:

```bash
# 1. Resolve the library id (always run this first)
npx ctx7@latest library angular "Angular component best practices: signals, OnPush, standalone, control flow"

# 2. Query the docs with the id returned above (currently /websites/angular_dev)
npx ctx7@latest docs /websites/angular_dev "Signals and computed for component state, toSignal from observable"
npx ctx7@latest docs /websites/angular_dev "Native control flow @if @for @switch and class style bindings"
```

Rules:

- Run `ctx7 library` before `ctx7 docs` unless an id in `/org/project` form is already known.
- Use the id Step 1 reports — do not hardcode it; the Angular entry currently resolves to
  `/websites/angular_dev` (not `/angular/angular`).
- Cap at **3** `ctx7` calls per task. On a quota error, tell the user context7 is unavailable and fall back
  to the links below.

## 3. Last resort — angular.dev links

- Style guide: https://angular.dev/style-guide
- Components guide: https://angular.dev/guide/components
- Signals: https://angular.dev/guide/signals
- RxJS interop (`toSignal`): https://angular.dev/ecosystem/rxjs-interop
- Control flow: https://angular.dev/guide/templates/control-flow
- Typed forms: https://angular.dev/guide/forms/reactive-forms

## Rule

Never silently skip the lookup. Report the source actually used — **Angular CLI MCP**, **`ctx7`** (with the
resolved library id), or the **angular.dev** fallback — so the user knows how current the guidance is.

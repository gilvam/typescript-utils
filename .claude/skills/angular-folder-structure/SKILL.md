---
name: angular-folder-structure
description: Scaffold and standardize an Angular application's folder structure using current Angular conventions — feature-based organization under src/app with core/_shared/features layers, standalone components, co-located files, lazy-loaded routes, and hyphenated naming. Pulls current Angular patterns via the Angular CLI MCP (get_best_practices/search_documentation) with the context7 ctx7 CLI as fallback. Use when starting a new Angular project, scaffolding a new feature folder, or standardizing an existing app's directory layout. Do not use for HTTP service modules — use angular-http for those.
allowed-tools: Read, Grep, Glob, Write, Edit, Bash, WebFetch
---

# Angular Folder Structure — Project & Feature Layout

Use this skill to lay out an Angular application the way the current Angular style guide recommends:
**organize by feature, not by file type**, keep standalone components with their template/style/spec
**co-located**, and split app-wide singletons (`core/`) from reusable presentational building blocks
(`_shared/`). It covers both a **new-project scaffold** and **adding a feature** to an existing app.

Ground every decision in current Angular docs: consult the **Angular CLI MCP** first, fall back to the
**context7 `ctx7` CLI**, then to **angular.dev** links — never standardize a layout from memory alone.

## When to use this skill

Use it when you are asked to:

- Set up the folder structure for a **new** Angular project.
- Add or organize a **feature** folder (pages, components, services, models, routes) in an existing app.
- **Standardize** or refactor an existing app's directory layout toward feature-based organization.
- Decide **where a file belongs** (`core` vs `_shared` vs a feature).

Do **not** use this skill for:

- HTTP/REST integration modules (DTOs, typed `HttpClient` services, mocks) — use the **`angular-http`** skill.
- Component/UI implementation logic, state management, or styling decisions — use the **`angular-patterns`** skill.

## Recommended flow

1. **Consult current Angular patterns** — Angular CLI MCP first, `ctx7` CLI fallback, angular.dev last. See
   [references/mcp-lookup.md](references/mcp-lookup.md).
2. **Detect the context** — greenfield vs existing app. In an existing app, **read the established
   convention first and mirror it**; only impose this layout on a new project or when explicitly asked to
   standardize. See [references/feature-structure.md](references/feature-structure.md).
3. **Apply the layout** — `core/` / `_shared/` / `features/` under `src/app`, with lazy-loaded routes. See
   [references/project-structure.md](references/project-structure.md).
4. **Scaffold with the CLI** — `ng new` / `ng generate` placing files in the right folders. See
   [references/scaffolding.md](references/scaffolding.md).
5. **Name everything consistently** — hyphenated, co-located, one concept per file. See
   [references/naming-conventions.md](references/naming-conventions.md).
6. **Verify** — `ng build` / `ng lint` pass and files landed in the documented paths.

## Non-negotiable rules (summary)

- **Organize by feature, not by type.** No global `components/`, `directives/`, or `services/` buckets.
- **Every routed component lives in `features/<feature>/pages/`.** Any component a route resolves to
  (`loadComponent`, a `loadChildren` group's targets, or `component:`) sits in its own `pages/<page>/` folder,
  one per route, with a **suffix-less** name matching the class (`order-list.ts` → `class OrderList`). Routes
  never point at `components/`, `_shared/`, or a feature root. (Match an existing app's suffix if it differs.)
- **Co-locate** a component's `.ts` / `.html` / `.css` / `.spec.ts` in the same folder, sharing one base name.
- **`core/` holds app-wide singletons** (guards, interceptors, app config); **`_shared/` holds reusable
  presentational pieces** with no singleton state; **feature code stays inside its feature folder**.
- **Standalone-first** — no `NgModule` files unless the existing project already uses them.
- **Lazy-load features** via `loadComponent` / `loadChildren` in `app.routes.ts` and `<feature>.routes.ts`.
- **Mirror an existing app's convention** when one exists; standardize only greenfield or on explicit request.
- HTTP modules are owned by **`angular-http`** and live under the project's `services/http` folder
  (default `src/app/services/http`).

## References

- [mcp-lookup.md](references/mcp-lookup.md) — pull current Angular docs via Angular CLI MCP / `ctx7` / angular.dev.
- [project-structure.md](references/project-structure.md) — canonical `core`/`_shared`/`features` layout + routing.
- [feature-structure.md](references/feature-structure.md) — anatomy of one feature folder + existing-app rules.
- [naming-conventions.md](references/naming-conventions.md) — file and symbol naming rules.
- [scaffolding.md](references/scaffolding.md) — `ng new` / `ng generate` commands to materialize the layout.

## Avoid

- No type-based top-level folders (`components/`, `services/`, `pipes/`) at the app or feature root.
- Never route to a component outside `pages/` — a route target under `components/`, `_shared/`, or a feature
  root is a mistake; move it into `pages/` (or, if it's truly presentational, it shouldn't be a route).
- No `NgModule` files in a standalone project.
- No feature-specific code in `core/` or `_shared/`, and no app-wide singletons in `_shared/`.
- Never force this layout onto an existing app that has a different, consistent convention — mirror it.
- Never redefine HTTP service modules here — defer to `angular-http`.
- Never silently skip the docs lookup — say which source you used (Angular MCP, `ctx7`, or angular.dev).

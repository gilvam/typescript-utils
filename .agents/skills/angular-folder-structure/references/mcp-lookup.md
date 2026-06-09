# Consult current Angular patterns (Angular CLI MCP → `ctx7` → angular.dev)

Before standardizing a layout, confirm the **current** Angular conventions so the structure matches the
installed Angular version. Use the sources in this order and **state which one you used** — never silently
fall back to memory.

## 1. Primary — Angular CLI MCP Server

The official Angular CLI MCP Server ships with `@angular/cli` (v20.2+) and is configured in the target
project's `.vscode/mcp.json` (or `.cursor/mcp.json`). When it is wired, prefer its tools:

- **`get_best_practices`** — current Angular conventions (standalone, control flow, folder/style guidance).
- **`search_documentation`** — query angular.dev docs (e.g. "project structure and naming conventions",
  "lazy loading standalone routes").
- **`list_projects`** — enumerate the workspace's projects/targets so you place files in the right project.
- **`find_examples`** — pull example layouts and route configurations.

Use specific, full-sentence queries (e.g. *"How to organize an Angular app by feature with lazy-loaded
standalone routes"*), not single words.

> The MCP may not be wired in every environment. If its tools are unavailable, move to `ctx7`.

## 2. Fallback — context7 `ctx7` CLI

Same pattern the `angular-http` and `context7` skills use. Resolve the library id first, then query docs:

```bash
# 1. Resolve the library id (always run this first)
npx ctx7@latest library angular "Angular project structure, folders by feature, and naming conventions"

# 2. Query the docs with the id returned above (currently /websites/angular_dev)
npx ctx7@latest docs /websites/angular_dev "Angular folder structure organized by feature, core and _shared"
npx ctx7@latest docs /websites/angular_dev "Lazy loading standalone components with loadChildren and loadComponent"
```

Rules:

- Run `ctx7 library` before `ctx7 docs` unless an id in `/org/project` form is already known.
- Use the id Step 1 reports — do not hardcode it; the Angular entry currently resolves to
  `/websites/angular_dev` (not `/angular/angular`).
- Cap at **3** `ctx7` calls per task. On a quota error, tell the user context7 is unavailable and fall back
  to the links below.

## 3. Last resort — angular.dev links

- Style guide (project structure + naming): https://angular.dev/style-guide
- Angular CLI MCP setup: https://angular.dev/ai/mcp
- Routing & lazy loading: https://angular.dev/guide/routing

## Rule

Never silently skip the lookup. Report the source actually used — **Angular CLI MCP**, **`ctx7`** (with the
resolved library id), or the **angular.dev** fallback — so the user knows how current the guidance is.

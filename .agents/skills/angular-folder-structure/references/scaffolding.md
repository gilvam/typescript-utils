# Scaffolding the layout with the Angular CLI

Use the Angular CLI to materialize the structure so files land in the documented folders. Confirm current
flags via the Angular CLI MCP `find_examples` / `get_best_practices` (or `ctx7`) before running — flag
defaults change between Angular versions (`mcp-lookup.md`).

> Show the commands first; **only execute them when actually applying the skill** (not while planning).

## New project (greenfield)

```bash
ng new <app-name> --routing --style=css
```

- Standalone is the **default** in current Angular — no `--standalone` flag needed.
- Pick `--style` to match the project (`css` / `scss`).
- This produces `src/main.ts`, `src/app/app.ts` (+ `.html`/`.css`), `app.config.ts`, and `app.routes.ts`.

Then create the layering (folders are created on first `ng generate`, or explicitly):

```bash
# created implicitly by the generate commands below, or up front if you prefer
mkdir src/app/core src/app/_shared src/app/features
```

## Generate into the right folders

The path you pass to `ng generate` decides where files land — use it to enforce the layout:

```bash
# Feature page (routed/container component)
ng generate component features/orders/pages/order-list

# Presentational component local to a feature
ng generate component features/orders/components/order-row

# Reusable presentational component (shared)
ng generate component _shared/components/data-table

# App-wide singleton service (core)
ng generate service core/services/auth

# Guard and functional interceptor (core)
ng generate guard core/guards/auth
ng generate interceptor core/interceptors/auth
```

Useful flags:

- `--project <name>` — target a specific project in a multi-project workspace (use `list_projects` from the
  Angular MCP to find names).
- `--flat` — generate a file without its own folder (e.g. a single guard or interceptor).
- `--skip-tests` — only if the project's convention omits specs (default is to generate `.spec.ts`).
- `--type` / generator naming options — align with the project's suffix-less vs legacy convention
  (`naming-conventions.md`). Set repo-wide defaults in `angular.json` under `schematics` so every generate
  matches the chosen style.

## Wire the feature route

After generating a feature's pages, add its `<feature>.routes.ts` and lazy-load it from `app.routes.ts`
(see `project-structure.md` for the route templates). Create the route file by hand or generate it, then
import it with `loadChildren`.

## Verify

```bash
ng build
ng lint        # if the project has a linter configured
```

Confirm the build passes and that the generated files landed in the documented paths (`core/`, `_shared/`,
`features/<feature>/pages|components`).

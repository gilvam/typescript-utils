# Canonical project structure

The current Angular style guide asks you to **organize by feature, not by file type**, keep all UI code under
`src/`, and co-locate each component's files. On top of that baseline this skill standardizes the widely-used
**`core` / `_shared` / `features`** layering so app-wide singletons, reusable presentational pieces, and
feature code each have a clear home.

## Layout

```
src/
├─ app/
│  ├─ core/                         # app-wide singletons, provided ONCE
│  │  ├─ guards/                    # route guards (CanActivate, CanMatch, …)
│  │  ├─ interceptors/              # HttpInterceptor functions
│  │  ├─ services/                  # cross-cutting singleton services (auth, config, logging)
│  │  └─ core.providers.ts          # optional: groups core EnvironmentProviders for app.config
│  ├─ _shared/                      # reusable, STATELESS presentational building blocks
│  │  ├─ components/                # dumb/presentational components reused across features
│  │  ├─ directives/
│  │  ├─ pipes/
│  │  └─ models/                    # cross-feature value types / interfaces
│  ├─ features/                     # one folder per feature; concrete example below
│  │  └─ orders/                    # ← example feature (see feature-structure.md for the full anatomy)
│  │     ├─ pages/                  # routed components ONLY — every route target lives here
│  │     │  ├─ order-list/          # order-list.ts (class OrderList) + .html/.css/.spec.ts
│  │     │  └─ order-detail/        # order-detail.ts (class OrderDetail) + .html/.css/.spec.ts
│  │     ├─ components/             # presentational, feature-local (e.g. order-row, order-status-badge)
│  │     │  └─ order-row/
│  │     ├─ services/               # feature-scoped services (e.g. order-store.ts)
│  │     ├─ models/                 # feature-scoped types (e.g. order.ts, order-status.ts)
│  │     └─ orders.routes.ts        # this feature's lazy-loaded route group
│  ├─ app.config.ts                 # application providers (router, http, interceptors)
│  ├─ app.routes.ts                 # top-level routes, lazy-loading each feature
│  ├─ app.ts                        # root component (current suffix-less naming)
│  ├─ app.html
│  └─ app.css
├─ main.ts                          # bootstrapApplication(App, appConfig)
└─ styles.css                       # global styles
```

> The root component uses the current **suffix-less** convention (`app.ts`). Older projects may use
> `app.component.ts`; match whatever the project already uses (see `naming-conventions.md`).

## Where a file belongs

| Put it in… | When it is… |
| --- | --- |
| `core/` | An **app-wide singleton** provided once: guard, interceptor, auth/config/logging service, app-level providers. |
| `_shared/` | A **reusable, stateless** presentational component, pipe, directive, or cross-feature type. **No singleton state.** |
| `features/<feature>/` | Used by **one feature only** — its pages, local components, services, and models. |

**Promote only on the second use.** Keep code inside its feature until a second consumer appears; only then
move it to `_shared/` (presentational) or `core/` (singleton). Premature sharing is the *Speculative
Generality* smell (see the `code-smell` skill).

## Routing (standalone, lazy-loaded)

- `app.routes.ts` lazy-loads each feature; the feature owns its own `<feature>.routes.ts`:

```ts
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.routes').then((m) => m.ordersRoutes),
  },
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
];
```

```ts
// features/orders/orders.routes.ts
import { Routes } from '@angular/router';

export const ordersRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/order-list/order-list').then((m) => m.OrderList) },
  { path: ':id', loadComponent: () => import('./pages/order-detail/order-detail').then((m) => m.OrderDetail) },
];
```

- Use `loadComponent` for a single standalone page and `loadChildren` for a feature's route group.
- **Every route target points into `pages/`.** The imports above resolve to `./pages/order-list/order-list`
  and `./pages/order-detail/order-detail` — routed components always live under the feature's `pages/`
  folder, with **suffix-less** names (`order-list.ts` → `class OrderList`), never under `components/` or a
  feature root (see `feature-structure.md`).
- **Standalone-first — no `NgModule` files.** Only keep modules if the existing project already uses them.

## Application config

Wire providers once in `app.config.ts` (router, HTTP, interceptors, core providers):

```ts
// app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

## Relationship to other skills

- **HTTP modules are owned by `angular-http`.** Typed `HttpClient` services + DTOs live under
  the project's `services/http` folder (default `src/app/services/http`); this skill places everything else
  and does not redefine them.
- Identifier/casing rules come from the **`code-standards-en`** skill (see `naming-conventions.md`).

## New-project scaffold checklist

1. Look up current conventions (`mcp-lookup.md`).
2. `ng new` (see `scaffolding.md`).
3. Create `app/core/`, `app/_shared/`, `app/features/`.
4. Wire `app.config.ts` and `app.routes.ts`.
5. Generate the first feature (`feature-structure.md` + `scaffolding.md`).
6. `ng build` / `ng lint`.

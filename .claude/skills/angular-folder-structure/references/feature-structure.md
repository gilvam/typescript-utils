# Feature folder anatomy & adding to an existing app

A **feature** is a self-contained slice of the app (a domain area or routed section). Everything the feature
needs lives inside its folder until a second consumer justifies promoting it to `_shared/` or `core/`.

## Anatomy of one feature

```
features/<feature>/
├─ pages/                 # routed / container components (smart): fetch data, hold state, compose children
│  └─ <page>/
│     ├─ <page>.ts
│     ├─ <page>.html
│     ├─ <page>.css
│     └─ <page>.spec.ts
├─ components/            # presentational (dumb) components local to this feature
│  └─ <component>/ ...
├─ services/              # feature-scoped services (provided in the feature's routes/components)
├─ models/               # feature-scoped types / interfaces / enums
└─ <feature>.routes.ts   # this feature's route group (lazy-loaded from app.routes.ts)
```

### Concrete example — an `orders` feature

```
features/orders/
├─ pages/                          # routed components ONLY
│  ├─ order-list/
│  │  ├─ order-list.ts             # @Component → export class OrderList
│  │  ├─ order-list.html
│  │  ├─ order-list.css
│  │  └─ order-list.spec.ts
│  └─ order-detail/
│     ├─ order-detail.ts           # export class OrderDetail
│     ├─ order-detail.html
│     ├─ order-detail.css
│     └─ order-detail.spec.ts
├─ components/                     # presentational, composed by the pages above
│  └─ order-row/
│     ├─ order-row.ts              # export class OrderRow — @Input()/@Output(), no route, no app state
│     ├─ order-row.html
│     └─ order-row.css
├─ services/
│  └─ order-store.ts              # export class OrderStore — feature-scoped state/data access
├─ models/
│  ├─ order.ts                    # export interface Order
│  └─ order-status.ts             # export type OrderStatus
└─ orders.routes.ts              # export const ordersRoutes — lazy-loaded from app.routes.ts
```

```ts
// features/orders/orders.routes.ts
import { Routes } from '@angular/router';

export const ordersRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/order-list/order-list').then((m) => m.OrderList) },
  { path: ':id', loadComponent: () => import('./pages/order-detail/order-detail').then((m) => m.OrderDetail) },
];
```

Guidelines:

- **Routed components always live in `pages/` (hard rule).** Every component a route resolves to — via
  `loadComponent`, the targets inside a lazy-loaded `loadChildren` group, or a `component:` entry — sits in
  `features/<feature>/pages/<page>/`, exactly **one routed component per subfolder**, named after the route.
- **Route components use suffix-less names** matching the class: `order-list.ts` → `class OrderList` (the
  Angular 2025 default). Do **not** add a `.page`/`.component` suffix unless the existing project already does
  — match the project's convention (see `naming-conventions.md`).
- **`pages/` vs `components/`** — `pages/` are the routed containers (one per route) that orchestrate data
  and state; `components/` are presentational pieces they compose. A presentational component takes inputs
  and emits outputs and holds no app state. **`components/` never holds a route target** — if a route points
  into `components/`, the component belongs in `pages/`.
- **Co-locate** each component's `.ts` / `.html` / `.css` / `.spec.ts` in its own folder, sharing one base
  name (see `naming-conventions.md`).
- **Feature-scoped services** stay in the feature; provide them at the route or component level rather than
  `root` unless they are genuinely app-wide singletons (those belong in `core/`).
- **Skip empty folders.** Create `components/`, `services/`, or `models/` only when the feature actually has
  them — don't scaffold empty buckets. `pages/` and `<feature>.routes.ts` are the only always-present parts.

## When to promote out of the feature

| Move it to… | Trigger |
| --- | --- |
| `_shared/` | A presentational component/pipe/directive is needed by a **second** feature, and it has no singleton state. |
| `core/` | A service must be a single app-wide instance (auth, config, logging) or it's a guard/interceptor. |

Promote on the *second* concrete use, not in anticipation — early sharing is the *Speculative Generality*
smell (`code-smell` skill).

## Adding a feature to an EXISTING app — detect, then mirror

Do **not** assume this skill's layout. First read what the app already does and follow it.

1. **Confirm it's an Angular workspace** — Glob for `angular.json` and `src/app/`.
2. **Read the established convention** — inspect existing siblings:
   - Glob `src/app/**/*.routes.ts` and the existing `features/` (or equivalent) folders.
   - Grep for `loadComponent` / `loadChildren` to see how routes are wired and how lazy loading is done.
   - Check whether files use suffix-less (`order-list.ts`) or legacy (`order-list.component.ts`) naming.
   - Check whether the app is standalone or still uses `NgModule`s.
3. **Mirror it.** Place the new feature where the existing ones live, match their internal subfolders
   (`pages/`/`components/` or whatever the app uses), and match the naming/routing style you found —
   including any route-component suffix the app uses (e.g. if it already names routed components
   `order-list.page.ts`, keep that; otherwise use suffix-less).
4. **Only impose this skill's layout** when the app has no consistent convention, or when the user
   explicitly asks to standardize/refactor the structure. Even then, keep **all routed components together in
   the feature's routed folder** (`pages/`, or the app's equivalent like `views/`), separate from
   presentational `components/`.
5. **Wire the route** into the parent routes file the same way the existing features are wired.

State the convention you detected and that you are mirroring it, so the user can confirm.

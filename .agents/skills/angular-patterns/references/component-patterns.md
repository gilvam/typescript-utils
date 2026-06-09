# Component patterns

Modern Angular components are **standalone**, use **OnPush** (or zoneless) change detection, inject
dependencies with **`inject()`**, and keep their template and styles in **separate files**.

## Three separate files (rule 1)

Keep each component split into its co-located trio, sharing one base name (see
`angular-folder-structure` → `naming-conventions.md`):

```
user-profile/
├─ user-profile.ts      # @Component with templateUrl + styleUrl
├─ user-profile.html    # template
├─ user-profile.css     # styles
└─ user-profile.spec.ts # unit test
```

```ts
// user-profile.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: 'user-profile.html',
  styleUrl: 'user-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile {}
```

- **Default to external files.** `templateUrl` + `styleUrl` is the Angular CLI default and the documented
  "organized/maintainable" choice. Generate with `ng generate component` (which produces the trio).
- **Exception:** a *trivial* component — a few lines of markup and no real styles — may inline its `template`
  (and skip `styles` entirely). Do not inline a non-trivial template just to save a file.
- **One concept per file**; co-locate the `.spec.ts` beside the component.

## Standalone, OnPush, `inject()`

- **Standalone is the default** — set component dependencies in the `imports` array; do **not** create
  `NgModule` files unless the project already uses them.
- **`changeDetection: OnPush`** on every component (or run the app zoneless with
  `provideZonelessChangeDetection()`); combined with signals this gives predictable, efficient updates.
- **Inject with `inject()`** rather than constructor parameters in new code:

```ts
export class UserProfile {
  private readonly users = inject(UserStore);
  private readonly route = inject(ActivatedRoute);
}
```

## Inputs / outputs as signals

Prefer the signal-based APIs over the legacy `@Input()` / `@Output()` decorators for new code:

```ts
export class UserCard {
  // signal inputs
  user = input.required<User>();
  compact = input(false);
  // two-way binding
  selected = model(false);
  // outputs
  remove = output<string>();
}
```

`input()` values are signals — read them as `this.user()` and derive with `computed()`.

## Host bindings in the decorator

Put host element bindings/listeners in the `@Component({ host })` object, **not** `@HostBinding` /
`@HostListener`:

```ts
@Component({
  selector: 'app-slider',
  templateUrl: 'slider.html',
  styleUrl: 'slider.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'slider',
    '[class.active]': 'isActive()',
    '[attr.aria-valuenow]': 'value()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Slider { /* ... */ }
```

## Smart vs presentational

- **Smart (routed) components** orchestrate data and state; they live in a feature's `pages/` folder (owned
  by `angular-folder-structure`).
- **Presentational components** take signal inputs, emit outputs, and hold **no** app state — easy to test
  and reuse. Keep components small; extract a presentational child when a template grows complex.

## Avoid

- Inline `template`/`styles` for non-trivial components.
- `NgModule` files in new standalone code.
- Constructor injection in new code (use `inject()`).
- `@HostBinding` / `@HostListener` (use the `host` object).
- Default (zone) change detection without a reason — prefer OnPush/zoneless.

# Templates — native control flow & bindings

Use the **built-in control flow blocks** and **direct bindings**; the legacy structural directives and
`NgClass`/`NgStyle` are superseded.

## Native control flow

Use `@if` / `@for` / `@switch`, never `*ngIf` / `*ngFor` / `*ngSwitch`:

```html
@if (user(); as u) {
  <app-user-card [user]="u" />
} @else {
  <p>No user selected.</p>
}

@for (item of items(); track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items.</li>
}

@switch (status()) {
  @case ('loading') { <app-spinner /> }
  @case ('error')   { <app-error /> }
  @default          { <app-content /> }
}
```

- **`@for` requires `track`.** Track by a stable id (`track item.id`); use `track $index` only for static,
  non-reordered lists.
- `@if (expr; as x)` aliases the value; `@for` exposes `$index`, `$first`, `$last`, `$even`, `$odd`.
- No import needed — control flow is built into the template compiler (drop `NgIf`/`NgFor` from `imports`).

## Lazy template sections with `@defer`

Defer non-critical or below-the-fold content to cut initial bundle/work:

```html
@defer (on viewport) {
  <app-comments [postId]="postId()" />
} @placeholder {
  <p>Scroll to load comments…</p>
} @loading (minimum 200ms) {
  <app-spinner />
}
```

## class / style bindings over NgClass / NgStyle

Prefer direct bindings — better readability and performance:

```html
<!-- ✅ -->
<div [class.active]="isActive()" [class.disabled]="disabled()"
     [style.color]="hasError() ? 'red' : null">…</div>

<!-- ❌ avoid -->
<div [ngClass]="{ active: isActive(), disabled: disabled() }">…</div>
```

Use a single `[class]="..."` / `[style]="..."` binding with an object/string only when the set of classes is
genuinely dynamic.

## Images

Use **`NgOptimizedImage`** (`ngSrc`) for static images to get lazy loading, srcset, and priority hints:

```html
<img ngSrc="hero.jpg" width="800" height="400" priority />
```

## Avoid

- `*ngIf` / `*ngFor` / `*ngSwitch` — use `@if` / `@for` / `@switch`.
- `@for` without `track`.
- `NgClass` / `NgStyle` for simple conditional classes/styles.
- Plain `<img src>` for static, important images — use `NgOptimizedImage`.

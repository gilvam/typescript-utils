# Reactivity — signals, RxJS, and async/await (rule 2)

Modern Angular is **signals-first** for state, with **RxJS** for streams and **plain async/await** reserved
for one-shot promises. Pick the right tool per job — do not force everything through one model.

## Decision table

| You have… | Use… | Why |
| --- | --- | --- |
| Component/local **state** (a value that changes over time) | `signal()` / `computed()` / `update()` | Synchronous, fine-grained reactivity; works with OnPush/zoneless. |
| A **stream / event source** (user input, websockets, polling), or async work needing **cancellation, operators, or combination** (`switchMap`, `debounceTime`, `retry`, `combineLatest`) | **RxJS** Observable | Cancellation + rich operators + composition are RxJS's real edge over promises. |
| A **one-shot** promise (a single `await` that resolves once and never needs cancellation) | `async`/`await` | Simpler and readable; no stream machinery needed. |
| Showing an Observable in a **template** | `toSignal()` or the `async` pipe | Auto-subscribe/unsubscribe; no manual `subscribe` in the component. |

## Signals for state

```ts
export class Cart {
  private readonly items = signal<CartItem[]>([]);
  readonly count = computed(() => this.items().length);
  readonly total = computed(() => this.items().reduce((s, i) => s + i.price, 0));

  add(item: CartItem) {
    this.items.update((list) => [...list, item]);
  }
}
```

## RxJS for streams (rule 2)

Use RxJS when you need cancellation/operators — e.g. a type-ahead search that cancels in-flight requests:

```ts
export class UserSearch {
  private readonly api = inject(UserApi);
  readonly query = signal('');

  // switchMap cancels the previous request; debounce avoids spamming — this is why RxJS, not async/await
  readonly results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => this.api.search(q)),
    ),
    { initialValue: [] as User[] },
  );
}
```

- **Bridge to the template** with `toSignal(...)` (read as `results()`), or use the `async` pipe in the
  template — never hand-roll `subscribe()` + manual `unsubscribe()` in a component.
- `toSignal()` subscribes immediately and unsubscribes automatically on destroy. Provide `initialValue`, or
  use `{ requireSync: true }` for sources (like `BehaviorSubject`) that emit synchronously.

## async/await only for one-shot

Acceptable — a single operation that resolves once and needs no cancellation:

```ts
async exportReport() {
  const blob = await this.reports.generate();   // one-shot, fine
  downloadBlob(blob);
}
```

**Not** acceptable — replacing a cancellable/stream flow with `async/await`:

```ts
// ❌ no cancellation, no debounce, races on fast typing
async onQueryChange(q: string) {
  this.results = await this.api.search(q);
}
```

Use the RxJS `switchMap` version above instead.

## Avoid

- Manual `subscribe()` in components without cleanup — use `toSignal` / `async` pipe (or `takeUntilDestroyed`).
- `async/await` for continuous streams or anything needing cancellation, debouncing, retries, or combination.
- Storing derived state in a writable signal — derive it with `computed()`.
- Mixing both models for the same value (e.g. a signal mirrored by a Subject) without a clear reason.

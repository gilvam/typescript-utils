# Forms — typed reactive forms

For anything beyond a trivial single input, use **typed reactive forms**, not template-driven forms.
Reactive forms give explicit, statically-typed models, easy validation, and testability.

## Build with a typed model

Use `inject(FormBuilder)` (or `NonNullableFormBuilder`) and let the types flow:

```ts
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: 'signup.html',
  styleUrl: 'signup.css',
})
export class Signup {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
  });

  submit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue(); // { email: string; password: string }
    // …
  }
}
```

```html
<!-- signup.html -->
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email" type="email" />
  @if (form.controls.email.touched && form.controls.email.invalid) {
    <small>Enter a valid email.</small>
  }
  <input formControlName="password" type="password" />
  <button [disabled]="form.invalid">Sign up</button>
</form>
```

## Rules

- **Typed forms** — never leave a `FormGroup` untyped; `NonNullableFormBuilder` avoids `null` in control
  types and `getRawValue()` returns a fully-typed object.
- **`ReactiveFormsModule`** in the standalone component's `imports`; do not use `FormsModule`/`ngModel` for
  non-trivial forms.
- **Validation** via `Validators` (and custom `ValidatorFn`s); show errors with native control flow
  (`@if (control.touched && control.invalid)`).
- **Access controls type-safely** through `form.controls.<name>`.
- Template-driven (`ngModel`) is acceptable only for a single, trivial input with no validation.

## Avoid

- Untyped `FormGroup` / `any` form values.
- Template-driven forms for multi-field or validated forms.
- Reading values via string paths (`form.get('email')?.value`) when `form.controls.email.value` is typed.

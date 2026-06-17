# DTO rules

Every DTO class must:

- Import `Dto` from the decorator and apply `@Dto()` immediately above the class. The relative
  import depth depends on where the module and decorator land — see [decorator.md](decorator.md); for the
  conventional layout it is `../../../../_decorators/class.decorator`.
- When the API payload has keys that are **not camelCase** (snake_case, PascalCase, kebab-case),
  apply `@Dto({ keyCamelCase: true })` — but **only on the root DTOs** whose `create()` /
  `createArray()` the `http-*` files (service and mock service) call inside the RxJS `map` with
  the raw API response. The conversion is deep (nested objects and arrays included), so nested
  DTOs receive already-camelCased objects and keep the plain `@Dto()`. Class properties stay in
  camelCase everywhere — never mirror the API's casing — and the conversion runs **only** in
  `create()` / `createArray()`, never in `new`, so raw JSON always enters through the factories.
  See [Non-camelCase API payloads](#non-camelcase-api-payloads).
- Use constructor `public` properties with a safe default for **every** field.
- Expose `static create(item: Partial<Dto> = new this()): Dto`.
- Expose `static createArray(items: Partial<Dto>[] = []): Dto[]` when the DTO can appear in
  arrays.
- Map nested objects explicitly with `ChildDto.create(item.child)`.
- Map nested arrays explicitly with `ChildDto.createArray(item.items)`.

Never use `Object.assign`, spreads, raw JSON passthrough, or implicit constructor mapping for
nested DTOs. Never rely on `@Dto()` alone to convert nested structures (it does not recurse
— see [decorator.md](decorator.md)).

## Safe defaults by type

| Type        | Default            |
| ----------- | ------------------ |
| `string`    | `''`               |
| `number`    | `0`                |
| `boolean`   | `false`            |
| object DTO  | `new ChildDto()`   |
| DTO array   | `[]`               |
| enum        | safest enum member |

## Preferred DTO shape

```typescript
import { Dto } from '../../../../_decorators/class.decorator';
import { UserDto } from './user.dto';
import { RoleDto } from './role.dto';

@Dto()
export class UserResponseDto {
	constructor(
		public user = new UserDto(),
		public roles: RoleDto[] = [],
		public total = 0,
	) {}

	static create(item: Partial<UserResponseDto> = new this()): UserResponseDto {
		return new this(
			UserDto.create(item.user),
			RoleDto.createArray(item.roles),
			item.total,
		);
	}

	static createArray(items: Partial<UserResponseDto>[] = []): UserResponseDto[] {
		return (items).map((item) => UserResponseDto.create(item));
	}
}
```

## Non-camelCase API payloads

When the endpoint returns keys like `first_name` / `UserData` / `user-id`, the DTO stays
**identical** to the camelCase case — only the decorator options change:

```typescript
import { Dto } from '../../../../_decorators/class.decorator';
import { UserDataDto } from './user-data.dto';

@Dto({ keyCamelCase: true })
export class UserDto {
	constructor(
		public firstName = '',
		public userData = new UserDataDto(),
	) {}

	static create(item: Partial<UserDto> = new this()): UserDto {
		return new this(item.firstName, UserDataDto.create(item.userData));
	}
}
```

`UserDto.create({ first_name: 'Ana', user_data: { … } })` yields `firstName: 'Ana'` and hands the
already-camelCased `userData` object to `UserDataDto.create(...)`. That is exactly why the flag
belongs **only on this root DTO** — the one whose factory the `http-*` service calls in the
`map` with the raw API response: the deep conversion normalizes the whole tree up front, so the
nested `UserDataDto` keeps the plain `@Dto()`. Do not spread `{ keyCamelCase: true }` across
every `.dto.ts` of the module. Two limits to keep in mind: the conversion renames keys only —
explicit `create()`/`createArray()` mapping for nested DTOs is still required — and it runs
**only** in the static factories, so `new UserDto(rawJson)` would skip it entirely.

Keep the `jsons/` fixtures in the API's **original** casing so the specs prove the conversion —
see [testing.md](testing.md).

## Build order

Generate DTOs **inside-out**: leaf DTOs first, then the parent response DTO that composes
them. This guarantees each parent can call its children's `create()` / `createArray()`
factories.

## Local examples to mirror

- `[app-root]/services/http/weather/models/weather-condition.dto.ts` — leaf DTO with an enum
  default.
- `[app-root]/services/http/weather/models/current-weather.dto.ts` — DTO composing a nested DTO
  via `WeatherConditionDto.create(...)`.
- `[app-root]/services/http/weather/models/weather-report.dto.ts` — parent composing nested
  object + array DTOs.

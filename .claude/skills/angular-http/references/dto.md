# DTO rules

Every DTO class must:

- Import `NoNull` from the decorator and apply `@NoNull()` immediately above the class. The relative
  import depth depends on where the module and decorator land — see [decorator.md](decorator.md); for the
  conventional layout it is `../../../../_decorators/class.decorator`.
- Use constructor `public` properties with a safe default for **every** field.
- Expose `static create(item: Partial<Dto> = new this()): Dto`.
- Expose `static createArray(items: Partial<Dto>[] = []): Dto[]` when the DTO can appear in
  arrays.
- Map nested objects explicitly with `ChildDto.create(item.child)`.
- Map nested arrays explicitly with `ChildDto.createArray(item.items)`.

Never use `Object.assign`, spreads, raw JSON passthrough, or implicit constructor mapping for
nested DTOs. Never rely on `@NoNull()` alone to convert nested structures (it does not recurse
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
import { NoNull } from '../../../../_decorators/class.decorator';
import { UserDto } from './user.dto';
import { RoleDto } from './role.dto';

@NoNull()
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
		return (items ?? []).map((item) => UserResponseDto.create(item));
	}
}
```

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

# HTTP service rules

HTTP services must:

- Use `@Injectable({ providedIn: 'root' })`.
- Inject `HttpClient` with `inject(HttpClient)` — not constructor injection.
- Keep inputs strongly typed (primitives, typed param/body interfaces, or DTOs).
- Return `Observable<ResponseDto>` or `Observable<ResponseDto[]>`.
- Call `Dto.create(...)` / `Dto.createArray(...)` **explicitly** inside the RxJS `map`, even
  when the TypeScript type already looks compatible.
- Contain only request assembly and DTO mapping — no UI or business workflow logic.

## Single-object response

```typescript
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserResponseDto } from './models/user-response.dto';

@Injectable({
	providedIn: 'root',
})
export class HttpUserService {
	private readonly http = inject(HttpClient);

	search(name: string): Observable<UserResponseDto> {
		const params = new HttpParams().set('name', name.trim());

		return this.http
			.get<UserResponseDto>('/users', { params })
			.pipe(map((response) => UserResponseDto.create(response)));
	}
}
```

## Array response

When the API returns an array directly, use `createArray`:

```typescript
.pipe(map((response) => UserDto.createArray(response)))
```

## Local example to mirror

`[app-root]/services/http/weather/http-weather.service.ts` — typed input, `HttpParams`, and an
explicit `WeatherReportDto.create(...)` inside `map`.

# Mock service rules

Create `http-[service-name].mock.service.ts` when consumers need a test/demo implementation.
`extends` the real service, `override` each public method with the **same signature and return
type**, and return DTO instances (not raw JSON) from `of(...)`:

```typescript
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpUserService } from './http-user.service';
import { UserResponseDto } from './models/user-response.dto';
import searchMock from './jsons/search/200-ok.json';

@Injectable({
	providedIn: 'root',
})
export class HttpUserMockService extends HttpUserService {
	override search(_name: string): Observable<UserResponseDto> {
		return of(searchMock).pipe(map((response) => UserResponseDto.create(response)));
	}
}
```

## Rules

- Keep the overridden method signatures **identical** to the real service so the mock is a
  drop-in replacement.
- Map the mock JSON through the same `Dto.create(...)` / `Dto.createArray(...)` factory the
  real service uses — never return raw JSON.
- Prefix unused parameters with `_` (e.g. `_name`) to keep them documented but lint-clean.
- Import mock JSON from the module's own `jsons/[method]/` folder.

## Local example to mirror

`[app-root]/services/http/weather/http-weather.mock.service.ts` — extends the real service and
returns DTO instances built from a `jsons/` fixture.

# Test rules

## DTO specs (`models/[query-name].dto.spec.ts`)

Prove null-safety and explicit mapping. Cover:

- no input → all defaults
- `create(null)` → all defaults
- `create({})` → all defaults
- complete JSON → every field mapped (including nested DTOs and enums)
- partial JSON → provided values kept, the rest defaulted
- root `null` nested objects/arrays → default nested DTO instances / `[]`
- deeply nested `null` fields → nested DTO instances with their own defaults

## Service specs (`http-[service-name].service.spec.ts`)

Use Angular's HTTP testing utilities:

- Provide `provideHttpClient()` **before** `provideHttpClientTesting()`.
- Inject `HttpTestingController`; assert method, URL, trimmed query params, and body.
- Flush `mocks/[method]/200-ok.json` and assert the result is a DTO instance with mapped data.
- Flush 4xx/5xx mocks (table-driven) and assert `HttpErrorResponse` propagates with the
  original `status` and `error` payload.
- Call `httpMock.verify()` in `afterEach`.

## Table-driven error cases

```typescript
const errorTestCases = [
	{ name: '400-invalid-request', status: 400, mock: mock400InvalidRequest },
	{ name: '500-internal-server-error', status: 500, mock: mock500InternalServerError },
];

errorTestCases.forEach(({ name, status, mock }) => {
	it(`should handle ${name} with status ${status}`, () => {
		service.search('x').subscribe({
			next: () => { throw new Error('should have failed'); },
			error: (error) => {
				expect(error.status).toBe(status);
				expect(error.error).toEqual(mock);
			},
		});

		const req = httpMock.expectOne((r) => r.url === '/users');
		req.flush(mock, { status, statusText: 'Error' });
	});
});
```

## Local examples to mirror

- `[app-root]/services/http/weather/models/weather-report.dto.spec.ts` — the full DTO
  null-safety matrix (default / null / `{}` / complete / partial / deeply-nested-null).
- `[app-root]/services/http/weather/http-weather.service.spec.ts` — `HttpTestingController`
  setup, trimmed-param assertion, success mocks, and the table-driven 4xx/5xx cases.

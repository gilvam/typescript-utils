# Consult current Angular patterns via context7 (`ctx7`)

Before writing code, confirm the current Angular `HttpClient` and testing patterns with the
context7 CLI so the generated module matches the installed Angular version.

```bash
# 1. Resolve the library id (always run this first)
npx ctx7@latest library angular "Angular HttpClient setup and standalone inject() services"

# 2. Query the docs with the id returned above (currently /websites/angular_dev)
npx ctx7@latest docs /websites/angular_dev "HttpClient setup with provideHttpClient and inject"
npx ctx7@latest docs /websites/angular_dev "HttpClient unit testing with provideHttpClientTesting and HttpTestingController"
```

Use whatever id Step 1's output reports — do not hardcode it; the Angular entry currently
resolves to `/websites/angular_dev` (not `/angular/angular`).

## Rules

- Run `ctx7 library` before `ctx7 docs` unless an id in `/org/project` form is already known.
- Use specific, full-sentence queries — not single words.
- Cap at **3** `ctx7` calls per task. On a quota error, tell the user context7 is unavailable
  and fall back to the canonical links below (do not silently skip the lookup).

## Fallback / reference docs

- Style guide: https://angular.dev/style-guide
- HttpClient setup: https://angular.dev/guide/http/setup
- HttpClient testing: https://angular.dev/guide/http/testing

## Environment note

context7 is not wired as an MCP server in this project (`.vscode/mcp.json` only configures the
`angular-cli` MCP), so this skill uses the `ctx7` CLI directly. Optional one-time setup: add a
local `context7` skill or install the `ctx7` CLI globally (`npm install -g ctx7@latest`).

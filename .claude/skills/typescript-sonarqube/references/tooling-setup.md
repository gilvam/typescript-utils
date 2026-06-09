# Tooling setup

## A. Local rules via eslint-plugin-sonarjs (recommended, offline)
This repo uses ESLint **flat config** (`eslint.config.ts`).

```bash
npm i -D eslint-plugin-sonarjs
```

```ts
// eslint.config.ts
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  // ...existing config
  sonarjs.configs.recommended,
];
```

Run the existing lint script (or `npx eslint .`). Findings appear as `sonarjs/<rule>`, e.g.
`sonarjs/cognitive-complexity`, `sonarjs/no-identical-functions`. The ESLint id for each
SonarJS key is in `rules-reference.md`.

To tune a single rule, override it after the recommended config, e.g.:

```ts
{ rules: { 'sonarjs/cognitive-complexity': ['error', 20] } }
```

> The local plugin covers Bug/Code-Smell rules but **not** cross-function taint analysis — for
> the security rules in `security.md` you need the server (section C).

## B. IDE — SonarQube for IDE (SonarLint)
JetBrains (this is an `IdeaProjects` project): install the **SonarQube for IDE** plugin.
Rules can be tuned per-key in settings; the key format is `<lang>:<rule>`:

```json
{
  "sonarlint.rules": {
    "typescript:S1854": { "level": "On" },
    "javascript:S1135": { "level": "Off" }
  }
}
```

Bind to a server with **Connected Mode** to inherit the team's Quality Profile and Quality Gate.

## C. Full server analysis (SonarQube / SonarCloud)
Create `sonar-project.properties` at the repo root:

```properties
sonar.projectKey=<key>
sonar.organization=<org>               # SonarCloud only
sonar.host.url=https://sonarcloud.io   # or self-hosted URL
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts
sonar.exclusions=**/node_modules/**,**/dist/**
sonar.sourceEncoding=UTF-8
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.tsconfigPaths=**/tsconfig.json
```

Notes:
- The scanner uses the **TypeScript compiler** for type-aware analysis; it resolves `tsconfig`
  via `sonar.typescript.tsconfigPaths`, by walking the filesystem, or by creating a temp one.
  Keep the files in `sonar.sources` consistent with what `tsconfig` includes.
- `npm test` runs `jest --coverage`, which emits `coverage/lcov.info` (lcov is in Jest's
  default reporters), so the `lcov.reportPaths` above is correct.
- On Windows, write paths with `/`, not `\`.

Run the scanner with the token in the environment (never commit it):

```powershell
$env:SONAR_TOKEN = "<token>"
npx sonar-scanner
```

### Large / orphan-file performance
If analysis is slow or OOMs on many loose JS/TS files, either split analysis across multiple
`tsconfig` files or disable per-orphan TS programs:

```json
{ "sonar.javascript.createTSProgramForOrphanFiles": false }
```

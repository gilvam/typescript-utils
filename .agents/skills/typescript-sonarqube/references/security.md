# SonarJS security: Vulnerabilities & Security Hotspots (TypeScript)

SonarQube splits security findings into two kinds (this is what the Bug/Code-Smell-only view
misses):

- **Vulnerability** — code that is exploitable as written. Many of these come from
  **taint analysis** (data-flow from a user-controlled *source* to a dangerous *sink*), which
  **only the SonarQube/SonarCloud server computes** — `eslint-plugin-sonarjs` does not do
  cross-function taint tracking.
- **Security Hotspot** — security-sensitive code that needs a human to *review* (not
  necessarily a bug). The reviewer marks it Safe / Fixed / Acknowledged.

## Vulnerability families for JS/TS (with CWE)
Source: SonarQube project security reports — these categories are tracked for JS/TS.

| Family | CWE | Typical sink |
|---|---|---|
| Code Injection | CWE-94 | `eval`, `Function()`, `vm.runInContext` |
| Command Injection | CWE-78 | `child_process.exec(userInput)` |
| Path Traversal | CWE-22 | `fs.readFile(path.join(base, userInput))` |
| Cross-Site Request Forgery | CWE-352 | state-changing route without CSRF protection |
| SQL Injection | CWE-89 | string-concatenated queries |
| Server-Side Request Forgery | CWE-918 | `fetch(userControlledUrl)` |
| Cross-Site Scripting (XSS) | CWE-79 | `el.innerHTML = userInput`, unescaped templating |

## Notable security rule keys (verify on rules.sonarsource.com)
These also power **AI CodeFix**: S2076, S2078, S2083, S3649, S5131, S5144, S5145, S5146,
S5167, S5334. A few common JS/TS ones:

| Key | Issue |
|---|---|
| S2076 | OS command built from tainted input (command injection) |
| S2083 | path built from tainted input (path traversal) |
| S3649 | SQL query built from tainted input |
| S5131 | tainted data echoed into the response (XSS) |
| S5146 | open redirect from tainted input |
| S5144 | SSRF — request to a tainted URL |
| S2068 | hardcoded credentials |
| S4790 | weak hashing (security hotspot) |
| S2245 | use of pseudorandom `Math.random()` for security (hotspot) |

## What's new (SonarQube 2026.2)
Six new JS/TS security rules were added, covering **injection attacks, untrusted environment
variables, and filesystem oracle attacks**. If the user is on an older server these won't fire —
mention the version dependency.

## How to apply during a manual review
- You can flag the **obvious sink-with-tainted-source** patterns in the table by reading the
  code, and the **hotspots** (hardcoded secrets, weak crypto, `Math.random` for tokens).
- Be explicit that **full taint analysis requires the server** — don't claim a clean bill of
  health on injection just from a local read. Recommend step 3 (server) in `SKILL.md` when
  security is the user's real concern.

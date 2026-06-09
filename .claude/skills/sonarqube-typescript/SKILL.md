---
name: sonarqube-typescript
description: Review TypeScript code against SonarQube/SonarJS rules and run a SonarQube-style static analysis locally. Use when the user asks for a "SonarQube", "Sonar", "SonarLint" or "SonarJS" review of TypeScript, wants to check code smells/bugs/complexity the way SonarQube would, or wants to set up Sonar analysis for the project.
---

# SonarQube for TypeScript

SonarQube analyzes TypeScript through its **SonarJS** analyzer, which uses the TypeScript
compiler's semantic model and type-checking for accurate, type-aware findings. The same rule
engine ships as the open-source ESLint plugin **`eslint-plugin-sonarjs`**, so the most valuable
rules run locally with no server. Use that for code review; use a real SonarQube/SonarCloud
server only when the user wants the dashboard, quality gate, security (taint) analysis, or
coverage tracking.

This skill is split into reference files. **Load only what the task needs** — do not read all
of them up front.

| File | Load it when… |
|---|---|
| `references/rules-reference.md` | Doing a review — verified Bug / Code Smell rule keys with fixes |
| `references/security.md` | The user cares about vulnerabilities, security hotspots, or injection/XSS |
| `references/clean-code-taxonomy.md` | The user asks about severities, MQR vs Standard mode, or how Sonar grades issues |
| `references/tooling-setup.md` | Setting up `eslint-plugin-sonarjs`, the scanner, `sonar-project.properties`, or IDE binding |

## Workflow

### 1. Manual review (default — no credentials, offline)
Read the changed/target `.ts` files. Load `references/rules-reference.md` and check the code
against those rule keys. If the user mentioned security, also load `references/security.md`.
Report findings as:

```
file:line — Sxxxx (rule name) [Bug | Code Smell | Vulnerability | Security Hotspot]
  explanation + concrete fix
```

Group by issue type. For this repo specifically, watch the decorator wrappers in
`src/decorators/` for high **Cognitive Complexity (S3776)**, duplicated string literals
(**S1192**), and identical method bodies (**S4144**).

### 2. Run it locally (when the user wants tooling)
Load `references/tooling-setup.md` and wire up `eslint-plugin-sonarjs` into the existing flat
config (`eslint.config.ts`). Findings surface as `sonarjs/<rule>`.

### 3. Full server analysis (only if requested)
Load `references/tooling-setup.md` for `sonar-project.properties`, the scanner invocation,
`tsconfig` handling, and JetBrains Connected Mode. Server analysis is the **only** way to get
the deeper security (taint) rules from `references/security.md`.

## Hard rules
- **Never invent rule keys.** Every key you cite must come from a reference file here or be
  verified at https://rules.sonarsource.com/typescript/. If unsure, say so.
- Prefer steps 1–2 for day-to-day review; they need no token and run offline.
- Never commit a `SONAR_TOKEN` — pass it via the environment.

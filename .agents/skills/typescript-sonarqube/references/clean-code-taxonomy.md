# Clean Code taxonomy, modes & severities

This is the model modern SonarQube uses to grade issues. Knowing it lets you explain *why* a
finding matters and how severe it is — not just name a rule.

## Two grading modes
SonarQube can run in one of two modes, and the severity vocabulary differs:

| | **MQR mode** (Multi-Quality Rule, current default) | **Standard Experience** (legacy) |
|---|---|---|
| Issue groups | Issue / Security Hotspot, each impacting software qualities | Bug / Vulnerability / Security Hotspot / Code Smell |
| Severities | **Blocker, High, Medium, Low, Info** | **Blocker, Critical, Major, Minor, Info** |
| Per issue | may impact several software qualities at once | one type, one severity |

When you report findings, prefer the MQR vocabulary (Blocker/High/Medium/Low/Info) unless the
user says they're on Standard mode.

## Software qualities
Every rule is linked to one or more of these, and breaking it impacts that quality with an
inherited severity:

- **Security** — exploitable weaknesses.
- **Reliability** — code that is or will be demonstrably wrong (the old "Bug").
- **Maintainability** — code that is harder than necessary to understand or change (the old
  "Code Smell").

## Clean Code attributes (the *why* behind a rule)
Each rule evaluates one **code attribute**, grouped into four families:

- **Consistency** — uniform formatting, conventional idioms, identifiable naming.
- **Intentionality** — code that is clear, logical, complete, and efficient.
- **Adaptability** — focused, distinct, modular code that's easy to evolve.
- **Responsibility** — ethical/legal obligations: lawful, trustworthy, respectful handling of
  data and people.

Example framing in a review:
> `S3776` (Cognitive Complexity) — **Maintainability / Adaptability**, severity **High**: this
> function is too branchy to evolve safely; extract the validation block.

## Quality Gate (server only)
A Quality Gate is the pass/fail threshold on a project (e.g. "no new Blocker issues, coverage
on new code ≥ 80%"). It lives on the server and gates CI/PRs. Mention it only when the user runs
the full server (step 3 in `SKILL.md`); it has no meaning for local ESLint runs.

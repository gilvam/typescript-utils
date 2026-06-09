# Naming conventions

Naming follows the current Angular style guide. For identifier-level rules (casing, verb-led functions,
length), defer to the repo's **`code-standards-en`** skill; this file covers the **file and folder** rules
specific to Angular structure.

## File names

- **Separate words with hyphens.** A `UserProfile` component lives in `user-profile.ts`.
- **Co-locate and share one base name.** A component's TypeScript, template, and style files share the same
  name with different extensions: `user-profile.ts`, `user-profile.html`, `user-profile.css`.
- **Unit tests end with `.spec.ts`**, beside the code under test: `user-profile.spec.ts`.
- **One concept per file** — one component, directive, service, or pipe per file.

## Suffix-less vs legacy suffixes

The current Angular style guide uses **suffix-less** file names for components and services:

| Concept | Current (suffix-less) | Legacy (still common) |
| --- | --- | --- |
| Component | `user-profile.ts` → class `UserProfile` | `user-profile.component.ts` → `UserProfileComponent` |
| Service | `user.ts` / `user-api.ts` → class `UserApi` | `user.service.ts` → `UserService` |
| Guard | `auth-guard.ts` | `auth.guard.ts` |
| Interceptor | `auth-interceptor.ts` | `auth.interceptor.ts` |
| Route group | `<feature>.routes.ts` | `<feature>.routes.ts` |

**Detect, then match the project.** Grep existing files for `.component.ts` / `.service.ts`. If the project
already uses legacy suffixes, keep using them for consistency; only adopt suffix-less naming in a greenfield
project or when explicitly standardizing. Configure the generator default accordingly (`scaffolding.md`).

## Folder names

- **kebab-case** for all folders: `features/order-history/`, `_shared/components/data-table/`.
- Folder names describe the **feature or concept**, not the file type — no `components/` / `services/`
  buckets at the app or feature root beyond the agreed `pages/` / `components/` split inside a feature.

## Symbol names (summary — see `code-standards-en`)

- Classes and interfaces: `PascalCase` (`UserProfile`, `OrderRoutes`).
- Methods, functions, variables: `camelCase`.
- Route group constants: `camelCase` ending in `Routes` (`ordersRoutes`).
- Author identifiers in **English**; avoid cryptic abbreviations.

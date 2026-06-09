
You are an expert in TypeScript. You write functional, maintainable, performant, and accessible code following TypeScript best practices.

## Resumo das skills

| Skill                       | O que faz                                                                                                                                                                                                                                                                       | Quando usar                                                                                                                                                                                                                          |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **angular-developer**       | Gera código Angular e orienta arquitetura em toda a stack: componentes, reatividade (signals, `linkedSignal`, `resource`, `effect`), forms (signal/reactive/template), DI, routing, SSR/rendering, acessibilidade (Angular Aria), animações, estilização (component styles + Tailwind), testes e CLI/migrações. Roda `ng build` ao final. | Ao **criar projeto/componente/serviço** ou para best practices amplas (DI, routing/guards, SSR, ARIA, animações, CLI, migrations). Para regras específicas da casa: layout → `angular-folder-structure`, HTTP → `angular-http`, padrões de componente/TS → `angular-patterns`/`typescript-patterns`. |
| **angular-folder-structure** | Estrutura a árvore de pastas Angular: organização por feature sob `src/app` com camadas `core`/`_shared`/`features`, standalone, arquivos co-localizados, rotas lazy, **componentes de rota em `pages/`** e nomes com hífen. Consulta Angular CLI MCP → `ctx7`.                    | Ao **iniciar ou organizar** projeto/feature e decidir onde um arquivo vive (`core`/`_shared`/`features`); todo componente de rota em `pages/`. Em projeto existente, espelhe a convenção. Módulos HTTP → `angular-http`; padrões de componente → `angular-patterns`. |
| **angular-http**            | Cria módulos de integração HTTP padronizados em `services/http` colocado **o mais próximo do consumidor** (na feature que usa, ou na raiz se app-wide/único): serviços `HttpClient` tipados, DTOs com `@NoNull()` e `create()/createArray()`, mock service e testes. Consulta via `ctx7`.                                                                                     | Ao **criar ou padronizar** qualquer chamada REST: módulo em `services/http/http-<nome>/` com DTOs `@NoNull()` (`create()/createArray()`), mock service e specs. Não usar para lógica de UI (veja `angular-patterns`).                  |
| **angular-patterns**        | Boas práticas de Angular moderno (componentes/templates/reatividade/forms): standalone com 3 arquivos (`.ts`/`.html`/`.css`), signals p/ estado e RxJS p/ streams (async/await só one-shot), OnPush/zoneless, control flow nativo (`@if`/`@for`/`@switch`), `inject()`, forms reativos tipados. Consulta Angular CLI MCP → `ctx7`. | Ao **escrever ou revisar** componentes/diretivas/pipes, modelar estado (signals vs RxJS vs async/await), escolher construtos de template ou montar forms. Não usar para layout de pastas (`angular-folder-structure`) nem HTTP (`angular-http`). |
| **code-smell**              | Catálogo de 94 code smells em TypeScript/JS em 12 categorias, com exemplo "antes/depois" e refatoração.                                                                                                                                                                          | Ao **escrever ou revisar** código novo/refatoração: cite o smell pelo nome em inglês e justifique por SOLID/Clean Code. Não serve para detectar bugs funcionais.                                                                      |
| **code-standards-en**       | Padrões de código: identificadores em inglês, casing, funções iniciadas por verbo, parâmetros como objeto, CQS, early returns, limites de tamanho de método/classe, comentários mínimos.                                                                                          | Ao **nomear ou estruturar** funções/classes e revisar PRs: identificadores em inglês, verbo-first, params como objeto, CQS, early returns, limites de tamanho. Não usar quando a política exigir nomes localizados.                   |
| **context7**                | Recupera documentação técnica atualizada e exemplos de código de qualquer tecnologia via CLI `ctx7`.                                                                                                                                                                             | Ao **consultar** docs/API de qualquer lib antes de codar: `ctx7 library <nome>` → `ctx7 docs <id>`. Máx. 3 chamadas; em quota, caia para os links oficiais e avise.                                                                   |
| **typescript-patterns**     | Padrões TypeScript da casa: arquivos kebab-case espelhando o símbolo, uma declaração por arquivo com sufixo (`.model.ts`/`.interface.ts`/`.enum.ts`), classes p/ modelos de domínio com `new`, interfaces com prefixo `I`, enums p/ conjuntos fechados, chaves em todo `if`, métodos de iteração de array em vez de loops, `.at()` no lugar de `[]`, teste por unidade. Consulta via `ctx7`. | Ao **escrever ou revisar** TypeScript, nomear arquivos/tipos ou modelar dados. Defere casing → `code-standards-en`, layout Angular → `angular-folder-structure`, DTOs HTTP → `angular-http`.                                          |
| **vitest-testing**          | Orienta testes unitários e de integração com Vitest: mocks com `vi`, Arrange–Act–Assert, fake timers para `Date`, testes de endpoint HTTP sem supertest, com cobertura por caso de uso e domínio.                                                                                                                          | Ao **escrever ou refatorar** testes: mocks com `vi`, Arrange–Act–Assert, um comportamento por teste, fake timers para `Date`, HTTP como integração. Não usar em projetos Jest/Sinon.                                                  |

## Convenções rápidas

- **Stack:** Angular (frontend em `frontend/`), TypeScript, testes com Vitest.
- **Estrutura:** organizar por feature (`core`/`_shared`/`features`), standalone-first, sem `NgModule`; componentes de rota em `pages/`.
- **HTTP:** todo código de integração isolado em `services/http/`, colocado o mais próximo do consumidor (na feature que usa, ou na raiz se app-wide/único), com DTOs `@NoNull()`.
- **TypeScript:** uma declaração por arquivo com sufixo de tipo, métodos de iteração de array em vez de loops, `.at()` em vez de `[]`.
- **Qualidade:** código e identificadores em inglês; valide com `ng build` / `ng lint` / testes.
- **Docs:** consulte `context7` (`ctx7`) quando a precisão importar, em vez de confiar na memória.

## Skills declaradas

As skills instaladas e seus hashes estão em [`skills-lock.json`](./skills-lock.json):

- `angular-developer`
- `angular-folder-structure`
- `angular-http`
- `angular-patterns`
- `code-smell`
- `code-standards-en`
- `context7`
- `typescript-patterns`
- `vitest-testing`

Cada skill vive em `.agents/skills/<nome>/SKILL.md`, com material de apoio em `references/`.

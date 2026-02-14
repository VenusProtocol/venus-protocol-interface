# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

- monorepo managed with Yarn workspaces and Turborepo
- primary app:
  - `@venusprotocol/evm` in `apps/evm`
- shared packages live in `packages/*` and shared configs in `configs/*`
- core stack used by the app:
  - react 19
  - typeScript
  - vite for dev/build tooling
  - vitest + Testing Library for tests
  - react Router for routing
  - tanStack Query for server-state/data fetching
  - wagmi + Viem for EVM wallet and chain interactions
  - tailwind CSS for UI and styling
  - i18next for translations/localization
  - biome + Stylelint for linting and formatting

## Folder structure

- workspaces are split by responsibility:
  - `apps/*`: runnable applications
  - `packages/*`: shared domain/UI/library code
    - `packages/ui`: shared components, fonts, themes and UI-related utility functions. Only
      stateless, side-effect-free components meant to be reused go into this directory
  - `configs/*`: shared tooling and lint/type config
- use Turbo filter scoping to run only what is relevant:
  - `yarn <command> --filter=@venusprotocol/evm` for dApp-only work
  - `yarn <command>` from root for cross-workspace changes
- structural rule for this repository: keep resources as close as possible to where they are used
  - place helpers, hooks, types, tests, styles, mocks, fixtures, and constants next to the feature
    that consumes them
  - promote code to `packages/*` only when it is intentionally shared across multiple features/apps
  - do not create broad shared folders for one-off usage
- inside evm app:
  - `containers/` contains components with side effects
  - `components/` contains side-effect-free reusable components

## Technical debt

- mui/emotion/styled components: replaced with Tailwind CSS. when working on a component that uses
  MUI, Emotion or Styled components, use Tailwind to execute the requested task
- formik/Yup: replaced with React Hook Form + Zod, or custom logic in complicated cases (but we
  favor using React Hook Form + Zod)
- `components` folder inside evm app: the component inside it will be moved to the `packages/ui` package

## Environment and setup

- use Node version from `.nvmrc`
- package manager: `yarn` (do not switch to npm/pnpm)
- install dependencies from repo root:

```bash
yarn
```

- for dApp work (`apps/evm`), configure `.env` from `apps/evm/.env.template` before running the app

## Common commands

Run from repository root unless otherwise noted.

- start all selected Turbo targets:

```bash
yarn start
```

- start EVM app only:

```bash
yarn start --filter=@venusprotocol/evm
```

- lint:

```bash
yarn lint
```

- typecheck:

```bash
yarn tsc
```

- test:

```bash
yarn test
```

- format:

```bash
yarn format
```

## Code quality expectations

- follow Biome formatting/linting (`biome.json`)
- style linting is also enforced for app code
- keep changes focused; avoid unrelated refactors
- prefer fixing root causes over suppressing lint/type errors. If you absolutely need to suppress a lint/type error, explain why in handoff notes

## Generated files

- do not hand-edit generated artifacts
- use the generation command instead:

```bash
yarn generate
```

## Agent workflow

- do not be verbose; go straight to the point
- before editing, read nearby files to match current patterns
- when behavior changes, ask the human whether you should add/update tests
- keep files and dependencies colocated with the feature they serve
- do not introduce new dependencies unless necessary and justified. If you do add a dependency,
  explain why in the handoff notes
- when touching shared packages/configs, verify impacted apps
- update this AGENTS.md file when making changes to the codebase that would make some of the
  information incorrect. Only update/add the relevant information
- in handoff notes, include:
  - what changed (especially in shared packages/configs)
  - remaining risks/follow-ups

## Programming rules

- typescript runs in strict mode. Use 2-space indentation and UTF-8
- tests are placed in a `__tests__` folder next to the item they are testing
- files end with an empty line
- never use `null`
- no nested `if` statements
- no nested ternary conditional statements
- no `console.log`
- if some code you're working has technical debt (see [technical debt section](## Technical debt)),
  do not attempt to refactor it to use the replacement technology unless explicitly asked to
- always use camel case to name functions, variables, components, and directories
- keep components small, fully typed, and favor named exports for utilities
- each component is created inside an `index.tsx` file located inside a directory named after the
  component. Each file can only export one component
- each utility function is created inside an `index.ts` (or `index.tsx` file if it exports JSX)
  file located inside a directory named after the function. Each file can only export one function
- except for mock data/functions, each file should only export one function at most
- follow import order: 1) external libraries (e.g., `@venusprotocol/ui`, `react`), 2) internal
  imports (e.g., `components`, `hooks/...`), 3) relative paths (`./`, `../`). Leave a blank line
  between groups
- watch out for dependency cycles
- put emphasis on writing readable code developers can understand
- comment your code when necessary, especially for complex logics
- never commit secrets. Store them in `.env` and update the `.env.template` file with a placeholder
  if you add a new environment variable

## Repository skills

- skills that should be available to AI agents live in `skills/`

# Code Quality & Architecture Reference

This document defines code-quality and architecture rules that match the current Venus repository.
Rules here should not reference non-existent packages, paths, or tooling.

## Workspace architecture

Repository is a Yarn workspace monorepo managed by Turbo.

```txt
Root
├─ apps/
│  ├─ evm/        # Main dApp (React + Vite)
│  └─ landing/    # Landing app
├─ packages/
│  ├─ ui/         # Shared UI/theme package
│  └─ chains/     # Shared chain/token metadata package
└─ configs/       # Shared config packages (typescript/stylelint)
```

### Dependency direction (practical rule)

- App code in `apps/evm` should consume shared packages through workspace package names (`@venusprotocol/ui`, `@venusprotocol/chains`).
- Do not import using filesystem paths into `packages/*` internals from app code.
- Shared packages (`packages/ui`, `packages/chains`) must stay app-agnostic.

## EVM app layer conventions

Within `apps/evm/src`, the common structure is:

```txt
clients/      # API/subgraph clients and query/mutation hooks
libs/         # integration libraries (contracts, wallet, analytics, translations)
hooks/        # app-level reusable hooks
components/   # reusable UI components
containers/   # composed feature blocks
pages/        # route-level pages
utilities/    # pure helpers/formatters/calculations
```

### Access conventions

- `pages` / `components` / `containers` should consume data through named hooks from `clients/api` or app hooks.
- Avoid direct `restService(...)` and raw `publicClient.readContract(...)` in `pages/components/containers`.
- Infrastructure hooks in `libs`/`hooks` may use React Query primitives when needed (current repo already does this).

## TypeScript conventions

Source of truth: `configs/typescript/base.json`, package tsconfigs, and Biome settings.

- `strict: true` is enabled.
- `noUnusedVariables` and `noUnusedImports` are lint errors (Biome).
- `noNonNullAssertion` is warned (not fully forbidden).
- `noExplicitAny` lint rule is currently off; prefer stronger types unless legacy interop requires otherwise.
- Use explicit input/output types on public APIs (especially in `clients/api` and `utilities`).

### Public API typing pattern

```typescript
export interface GetSomethingInput {
  id: string;
}

export interface GetSomethingOutput {
  value: string;
}

export const getSomething = async (
  input: GetSomethingInput,
): Promise<GetSomethingOutput> => {
  // ...
};
```

## API/query quality rules

(See also `.claude/references/api-patterns.md`.)

- Use `FunctionKey` for query keys in `clients/api` query hooks.
- Keep `queryKey` deterministic and include all cache-shaping params (`chainId`, address, ids).
- Use `callOrThrow` when required dependencies may be undefined.
- Throw `VError` for domain/integration failures instead of silent fallbacks.
- In mutation hooks, invalidate affected query caches in `onConfirmed`.

## Styling architecture quality rules

- Shared theme/tokens come from `@venusprotocol/ui` (`theme`, `theme.css`, font exports).
- App global style entry is `apps/evm/src/assets/styles/index.css`.
- Current styling stack is mixed by design: Tailwind utility classes + Emotion/MUI styling + scoped CSS files.
- There are no CSS modules in current app source (`*.module.css` / `*.module.scss` absent). Do not introduce a parallel styling system without explicit need.

## Import conventions

Biome `organizeImports` is enabled; keep imports Biome-compatible.

### Preferred import style in `apps/evm/src`

- Use absolute aliases from `src` baseUrl for cross-feature imports (`clients/api`, `utilities`, `libs/*`, `hooks/*`, `components/*`).
- Use relative imports for local sibling files/folders.
- Keep type-only imports as `import type` where possible (Biome warns if not).

```typescript
import { useGetPools } from 'clients/api';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';

import { helper } from './helper';
```

## Naming conventions (observed in repo)

These match dominant existing patterns and should be followed for new code:

| Item | Convention |
|---|---|
| React components | `PascalCase` |
| Component folders | `PascalCase/` with `index.tsx` |
| Hooks | `useXxx` |
| Utility functions | `camelCase` |
| Constants | `UPPER_SNAKE_CASE` for true constants, otherwise descriptive `camelCase` exports |
| Test files | `*.spec.ts` / `*.spec.tsx` (often under `__tests__/`) |

## Generated code policy

Do not manually edit generated artifacts.

Common generated locations include:

- `apps/evm/src/libs/contracts/generated/*`
- `apps/evm/src/libs/tokens/generated/*`
- `apps/evm/src/clients/subgraph/gql/generated/*`
- `packages/chains/src/generated/*`

Regenerate using project scripts (`yarn generate-*`, `yarn generate`) instead.

## Package manager and scripts

- Workspace package manager is `yarn@1.22.21`.
- Use `yarn` commands from repo docs/scripts.
- Task orchestration is done via Turbo (`yarn lint`, `yarn test`, `yarn tsc`, `yarn build`).

## Testing stack and expectations

- Unit/integration tests use Vitest.
- React rendering tests use Testing Library.
- Test filenames in this repo use `*.spec.ts` / `*.spec.tsx`.

### Practical testing guidance

- Add/adjust tests for changed behavior in `utilities`, `clients/api`, hooks, and critical page flows.
- Prefer colocated tests in `__tests__/` near implementation.
- Use existing test utilities in `apps/evm/src/testUtils`.

## Prohibited or discouraged patterns

### Prohibited

- Importing app code from shared packages (`packages/ui` / `packages/chains` must remain app-agnostic).
- Manual edits to generated files.
- New code with unused imports/variables (fails lint).

### Discouraged (requires strong justification)

- Direct data fetching in route components when a `clients/api` hook already exists.
- Introducing new ad-hoc architecture layers or naming schemes in a single feature.
- Using `any` for new domain logic where a concrete type is available.
- Broad non-null assertions (`!`) in non-test code when guard logic can be added.

## Quick quality checklist (before PR)

- `yarn lint` passes.
- `yarn tsc` passes.
- Relevant tests pass (`yarn test` or scoped package tests).
- No generated files manually edited.
- New API logic follows `clients/api` query/mutation patterns.
- New UI code follows `.claude/references/design-system.md`.

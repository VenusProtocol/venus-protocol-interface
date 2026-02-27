# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
yarn

# Start dApp dev server
yarn start --filter=@venusprotocol/evm

# Start landing page dev server
yarn start --filter=@venusprotocol/landing

# Run all tests
yarn test

# Run tests for a specific file (from repo root)
yarn test -- apps/evm/src/path/to/file.spec.tsx

# Run tests scoped to evm app only
cd apps/evm && yarn test

# Type-check all packages
yarn tsc

# Lint (Biome + Stylelint)
yarn lint

# Format code
yarn format

# Build for production
yarn build

# Regenerate contract ABIs/addresses and token records
yarn generate --filter=@venusprotocol/evm
```

## Architecture

This is a **Turborepo monorepo** with the following workspaces:

- `apps/evm` — Main dApp (`@venusprotocol/evm`), built with Vite/React 19
- `apps/landing` — Landing page
- `packages/chains` — Chain definitions, token metadata, vToken records, and chain-level types (`@venusprotocol/chains`)
- `packages/ui` — Shared UI component library (`@venusprotocol/ui`)
- `configs/typescript` / `configs/stylelint` — Shared tooling configs

### Core types (`apps/evm/src/types/index.ts`)

Key domain types:
- `Token` / `VToken` — asset descriptors (from `@venusprotocol/chains`)
- `Asset` — a market asset with APY, balances, distributions, caps, etc.
- `Pool` — a lending pool with comptroller address, assets, eMode groups
- `ChainId` — enum of all supported chains (BSC, Ethereum, Arbitrum, opBNB, zkSync, Optimism, Base, Unichain + testnets)
- Numeric values use **BigNumber.js** and are in **mantissa** (raw on-chain units) unless suffixed `Tokens`, `Cents`, or `Percentage`

### Data layer (`apps/evm/src/clients/api/`)

- `queries/` — TanStack Query read hooks (e.g. `useGetPools`, `useGetPool`, `useGetAsset`)
- `mutations/` — Write hooks (e.g. `useSupply`, `useRepay`, `useSwapTokens`)
- Cache keys are the `FunctionKey` enum (`src/constants/functionKey.ts`)
- After mutations succeed (`onConfirmed`), invalidate relevant queries via `queryClient.invalidateQueries({ queryKey: [FunctionKey.XYZ, ...] })`

### Transaction pattern

All on-chain writes go through `useSendTransaction` (`src/hooks/useSendTransaction/index.ts`). Mutation hooks call it with a `fn` that returns `WriteContractParameters` (viem). The hook handles gasless transactions (ZyFi paymaster), Biconomy super-transactions, wallet/public client wiring, and notification tracking.

### Contracts (`apps/evm/src/libs/contracts/`)

- `generated/abis/` and `generated/addresses.ts` are **auto-generated** — do not edit manually
- Regenerate with `yarn generate --filter=@venusprotocol/evm`
- `getContractAddress({ name, chainId, poolComptrollerContractAddress? })` resolves addresses at runtime

### Chain/token data (`packages/chains/src/`)

- vToken records in `generated/vTokens.ts` are also auto-generated
- `Token.isNative` marks native chain currency (BNB); native tokens have a `tokenWrapped` field for the wrapped version (WBNB)
- `Token.address` is the zero address for native tokens

### Feature flags (`apps/evm/src/hooks/useIsFeatureEnabled/index.tsx`)

Features are enabled per-chain. Use `useIsFeatureEnabled({ name: 'featureName' })` in components to gate functionality. The `featureFlags` map lists which `ChainId[]` each feature applies to.

### App entry point and routing

`src/App/index.tsx` sets up providers: `HashRouter` → `MuiThemeProvider` → `QueryClientProvider` → `Web3Wrapper` (Wagmi + RainbowKit) → `AnalyticProvider` → `Routes`.

Routes are in `src/App/Routes/index.tsx` and use lazy-loaded page components from `src/pages/`.

### Testing

- Framework: **Vitest** with `jsdom` and `@testing-library/react`
- Tests run with `VITE_NETWORK=testnet VITE_ENV=ci`
- Use `renderComponent` / `renderHook` from `src/testUtils/render.tsx` — these wrap with all providers
- `src/setupTests.tsx` globally mocks: `clients/api`, `libs/wallet`, `libs/analytics`, `libs/tokens`, `hooks/useSendTransaction`, `hooks/useIsFeatureEnabled`, and others — tests override these with `vi.fn()` / `(hook as Mock).mockImplementation(...)`
- Mock model fixtures live in `src/__mocks__/models/` (pools, tokens, vTokens, proposals, etc.)
- Test files live alongside source in `__tests__/` subdirectories, named `index.spec.tsx`

### Code style

- **Biome** for JS/TS linting and formatting (single quotes, 100-char line width, trailing commas)
- **Stylelint** for CSS-in-JS
- Unused variables/imports are errors; exhaustive `useEffect` deps are errors
- Import types with `import type` where possible

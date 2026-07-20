# Venus Coding Guidelines

Keep changes small, focused, and aligned with existing code patterns.

## Core rules

- Use the Node.js version from `.nvmrc`.
- Keep your answers short and straight to the point.
- Follow YAGNI: do not add abstractions, configuration, dependencies, or features until they are
  needed.
- When building features, build a tiny, end-to-end slice of the feature first, seek feedback, then expand out from there.
- Prefer the simplest readable solution that satisfies the current requirement.
- Reuse existing components, hooks, utilities, and package APIs before creating new ones.
- Ensure your code complies with the repository’s linting and TypeScript rules. After writing code,
  run `yarn lint` and `yarn tsc` to check that it complies with the repository’s linting and
  TypeScript rules, then run targeted tests to make sure no regressions were introduced.
- Keep shared packages app-agnostic. App code in `apps/evm` must import shared code through
  workspace package names such as `@venusprotocol/ui` and `@venusprotocol/chains`, not filesystem
  paths into `packages/*`.
- Do not manually edit generated artifacts. Regenerate them with the relevant `yarn generate-*` or
  `yarn generate` script.
- Do not use `null` unless required by an external API/type outside this repository.
- Do not nest `if` statements or ternary expressions inside one another. Flatten logic using early
  returns, guard clauses, or helper functions instead.
- Every function or component must live in a dedicated directory named after it, exposing the
  implementation via `index.ts` / `index.tsx`.
- Each file must contain at most one function or one component. Do not co-locate multiple functions
  or components in the same file.
- Prefer guard clauses and early returns over nested conditionals or nested ternaries.
- Use clear unit suffixes for values: `Mantissa`, `Tokens`, `Ms`, `Percentage`, `Cents`; use `Date`
  for dates.
- React rendering tests use Testing Library.
- Unit/integration tests use Vitest.
- Only mock components when absolutely necessary.
- Prefer colocated tests in `__tests__/` near implementation.
- Before adding tests in a workspace, read its Vite config and setup files.
- We use Tailwind CSS as much as possible to style components. If you see any other framework being used (e.g.: Emotion CSS), consider this a technical debt and not a pattern to follow.
- Keep data fetching/mutations in `apps/evm/src/clients/api` hooks.
- Preserve existing behavior while applying visual fixes.
- Do not change formula/data-flow logic unless explicitly required by plan.

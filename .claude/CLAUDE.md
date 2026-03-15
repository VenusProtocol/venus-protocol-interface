# Venus Protocol Interface - Claude Rules

Before generating or modifying code in this repository, Claude must read:

1. `.claude/references/design-system.md`
2. `.claude/references/api-patterns.md`
3. `.claude/references/code-quality.md`

Mandatory behavior:

- Treat `.claude/references/design-system.md` as the primary design authority for typography, colors, spacing, and component styling patterns.
- Treat `.claude/references/api-patterns.md` as the source of truth for API/query/mutation layering, error handling, and cache-key conventions.
- Treat `.claude/references/code-quality.md` as the source of truth for workspace architecture, TypeScript quality rules, testing, and generated-file policy.
- Follow existing token and utility usage from `packages/ui/src/theme.css`, `packages/ui/src/theme.ts`, and `apps/evm/src/assets/styles/index.css`.
- Prefer `@venusprotocol/ui` exports (`cn`, `theme`, shared components) over ad-hoc implementations.
- Do not introduce raw hex/rgb color values for normal UI text/surfaces when a project token exists.
- For changed UI code, keep naming conventions consistent with local context (legacy camelCase tokens vs kebab-case tokens).

Output constraints for frontend tasks:

- Prioritize semantic HTML and project typography tokens.
- Reuse existing interaction states (`hover`, `active`, `disabled`) from current token families.
- Avoid introducing a new styling convention if one already exists in the target file/module.

Output constraints for data/API tasks:

- Follow existing `apps/evm/src/clients/api` patterns and `FunctionKey` query-key conventions.
- Prefer named hooks from `clients/api` in pages/components/containers instead of ad-hoc data access.
- Keep rules within existing project boundaries; do not invent paths, packages, or frameworks not present in this repository.

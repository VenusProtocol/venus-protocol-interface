---
name: pr-review
description: Review a PR against Venus Protocol coding standards (code quality, API patterns, design system). Accepts a PR number, URL, or auto-detects from the current branch.
---

**This skill is read-only. Do not edit, create, or delete any files. Only analyze and report.**

Review a pull request for compliance with Venus Protocol coding standards defined in:
- `.claude/references/code-quality.md`
- `.claude/references/api-patterns.md`
- `.claude/references/design-system.md`

## Setup

Extract from `$ARGUMENTS`:

- **pr** - PR number or GitHub URL (e.g. `123` or `https://github.com/.../pull/123`) — **optional, auto-detected from current branch if not provided**
- Extra instructions (free-form, e.g. "focus on naming conventions")

### PR auto-detection

If `pr` is not provided in `$ARGUMENTS`:

```bash
# Get the PR associated with the current branch
gh pr view --json number,title,url,baseRefName,headRefName 2>/dev/null
```

- If a PR is found -> use it automatically and display its title and number.
- If no PR is found -> abort with: "No open PR found for the current branch. Please provide a PR number: /pr-review <number>"

### Load reference documents

Always read all three reference files before reviewing (unless `scope=` restricts it):

```bash
cat .claude/references/code-quality.md
cat .claude/references/api-patterns.md
cat .claude/references/design-system.md
```


## Fetch PR data

```bash
# PR metadata
gh pr view {PR} --json number,title,body,baseRefName,headRefName,files

# Full diff
gh pr diff {PR}
```

Store the list of changed files and the full diff for analysis.

## Review phases

### Phase 1 — Changed file inventory

List all changed files grouped by layer:

| Layer | Path prefix | Relevant standards |
|---|---|---|
| API / query hooks | `apps/evm/src/clients/` | api-patterns |
| Utilities | `apps/evm/src/utilities/` | code-quality |
| Hooks | `apps/evm/src/hooks/` | code-quality, api-patterns |
| Components / Containers / Pages | `apps/evm/src/components/`, `containers/`, `pages/` | code-quality, design-system |
| Shared packages | `packages/ui/`, `packages/chains/` | code-quality, design-system |
| Generated files | see generated paths in code-quality.md | must not be manually edited |

### Phase 2 — Code quality checks

For each changed file, check the following rules from `code-quality.md`:

**File & module structure**
- [ ] Each file exports exactly one function or one component (no co-located multiple exports).
- [ ] The file lives in a directory named after it and is exposed via `index.ts` / `index.tsx`.
- [ ] No logic is duplicated that could be extracted into a shared utility, hook, or component.

**Control flow**
- [ ] No nested `if` statements or nested ternary expressions. Guard clauses / early returns used instead.

**TypeScript**
- [ ] No unused imports or variables.
- [ ] No `any` for new domain logic where a concrete type is available.
- [ ] Public APIs in `clients/api` and `utilities` have explicit input/output types.
- [ ] Non-null assertions (`!`) in non-test code are justified or replaced with guard logic.

**Naming conventions**
- [ ] React components: `PascalCase`.
- [ ] Component folders: `PascalCase/` with `index.tsx`.
- [ ] Hooks: `useXxx`.
- [ ] Utility functions: `camelCase`.
- [ ] Constants: `UPPER_SNAKE_CASE` for true constants.

**Data-type conventions (object properties)**
- [ ] Mantissa values suffixed `Mantissa` (e.g. `supplyApyMantissa`).
- [ ] Token amounts suffixed `Tokens` (e.g. `borrowedTokens`).
- [ ] Millisecond values suffixed `Ms` (e.g. `lockPeriodMs`).
- [ ] Percentage values suffixed `Percentage` (e.g. `collateralFactorPercentage`).
- [ ] Dollar / fiat amounts expressed in **cents** and suffixed `Cents` (e.g. `liquidationThresholdCents`). No fractional dollar amounts.
- [ ] Date properties on domain objects use the `Date` type (not `number` timestamps).

**Import conventions**
- [ ] Cross-feature imports use absolute aliases (`clients/api`, `utilities`, `hooks/*`, etc.).
- [ ] Local sibling imports use relative paths.
- [ ] Type-only imports use `import type`.

**Generated files**
- [ ] No manually edited generated files (paths listed in code-quality.md).

### Phase 3 — API pattern checks

For files under `clients/api` and any hooks/containers that fetch data:

- [ ] Query hooks use `FunctionKey` for query keys.
- [ ] `queryKey` is deterministic and includes all cache-shaping params (`chainId`, address, ids).
- [ ] `callOrThrow` used when required dependencies may be undefined.
- [ ] `VError` thrown for domain/integration failures (no silent fallbacks).
- [ ] Mutation hooks invalidate affected query caches in `onConfirmed`.
- [ ] No direct `restService(...)` or raw `publicClient.readContract(...)` in `pages/components/containers`.

### Phase 4 — Design system checks

For files under `components/`, `containers/`, `pages/`, and `packages/ui/`:

- [ ] No raw hex/rgb color values for UI text or surfaces when a project token exists.
- [ ] Typography, spacing, and color use project tokens from `@venusprotocol/ui`.
- [ ] Interaction states (`hover`, `active`, `disabled`) reuse existing token families.
- [ ] No new styling convention introduced when one already exists in the target file/module.
- [ ] No CSS modules (`*.module.css` / `*.module.scss`) introduced.
- [ ] Semantic HTML used for typography and structure.

## Output format

Print the review directly to the terminal. Do not save to disk.

### Report structure

```
## PR #N — Title  (branch → main)

### Verdict: PASS | NEEDS CHANGES

One-sentence summary.

### Critical  (N)
- [file:line] Rule violated — description of the issue.

### Warnings  (N)
- [file:line] Rule — description.

### Suggestions  (N)
- [file:line] Suggestion — description.
```

Omit any section that has zero items.

**Severity mapping:**

| Severity | Condition |
|---|---|
| Critical | Violates an explicit rule from the reference docs (prohibited pattern, wrong data-type convention, manual edit of generated file, nested conditional, multiple exports per file, etc.) |
| Warning | Violates a "discouraged" pattern or a naming convention |
| Suggestion | Missed reuse opportunity, minor style inconsistency, or improvement that does not violate a rule |

## Error handling

- **PR not found**: Abort with "PR '{PR}' not found. Check the number and that `gh` is authenticated."
- **`gh` not installed**: Abort with "GitHub CLI (`gh`) is required. Install it and run `gh auth login`."
- **No changed files**: Warn "PR has no changed files" and exit cleanly.
- **Reference file missing**: Warn which file is missing and continue with the remaining references.

## Usage examples

```bash
# Auto-detect PR from current branch
/pr-review

# Review a specific PR number
/pr-review 1234

# Review only API patterns for PR #99
/pr-review 99 scope=api

# Review with extra focus instruction
/pr-review 1234 focus on data-type property naming
```

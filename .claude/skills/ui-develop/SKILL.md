---
name: ui-develop
description: Use this skill whenever the user wants to build new Venus EVM UI from a Figma design or feature description. Converts Figma mockups into production-ready React + TypeScript components for this project (apps/evm) while following the  design system. **IMPORTANT: This skill does NOT use worktrees - all code is written directly to the current branch.**
---

Orchestrate a multi-phase UI development pipeline. Each phase is a dedicated sub-agent dispatched
via the Task tool. Generated code goes direct to monorepo paths; plan artifacts go to
`.ui-develop/ui-develop-{FEATURE}/` (never to `.ui-develop/` root).

**This skill covers phases 1-2 (Plan, Code). For i18n phase, use the `ui-i18n` skill. For QA phases (Preview, Review, Fix), use the `ui-qa` skill.**

## Setup

Extract from `$ARGUMENTS`:

- **Figma URLs** - one or more `figma.com/design/...` links (with optional labels)
- **Text description** - primary input if no Figma URL
- **mode** - how far the pipeline runs:
  - `plan` - Phase 1 only; present plan, stop
  - `code` - through Phase 2; code remains unstaged for review **(default)**
  - `auto` - run through Phase 2 automatically
- **plan=** - override plan agents (default: **auto**)
- **resume={feature}** - load state from `{ARTIFACTS}/state.json` and skip completed phases
- **from={phase}** - start from this phase, skipping all earlier phases regardless of state.
  Accepts names (`plan`, `code`) or numbers (`1`-`2`).
- Extra instructions (e.g. "skip plan", "dark mode only")

Parse Figma URLs into a list. One URL = single-page. Multiple = multi-page/multi-state.

### Dynamic agent allocation (plan)

When `plan=` is not explicitly specified, the pipeline **auto-determines** agent counts from complexity signals.

**Plan agents** - determined from Figma URL count (available before Phase 1):

| Signal | PLAN_AGENTS | Rationale |
|---|---:|---|
| 1 Figma URL | 1 | Single-page features are well-served by one plan |
| 2+ Figma URLs | 3 | Multi-page features benefit from PM + Architect + QA perspectives |
| Text-only input | 1 | No Figma to analyze in parallel |

**Explicit `plan=` always overrides** the auto-determined value. This means:

- `/ui-develop <url>` - auto (smart defaults)
- `/ui-develop <url> plan=1` - force single planner regardless of URL count

### Artifacts directory convention

All pipeline artifacts (plans, reviews, screenshots, state) go to a **feature-scoped subfolder**:

```txt
ARTIFACTS=.ui-develop/ui-develop-{FEATURE}
```

`{ARTIFACTS}` is used throughout this document as shorthand. When passing paths to sub-agents,
always substitute the full path (e.g., `.ui-develop/ui-develop-broker-affiliate/plan.md`).

**Never write artifacts to `.ui-develop/` root.** This prevents file collisions between features.

### Setup

**CRITICAL: This skill does NOT use worktrees. All work happens directly in the current branch.**

1. Extract a short feature name (e.g. `convert`, `help-center`)
2. `mkdir -p {ARTIFACTS}`
3. **DO NOT call `EnterWorktree`** - work directly in the current directory and current branch
4. **DO NOT create any worktree** - all code is written directly to the current branch

All commands run from the repository root. Use standard `yarn` and `yarn tsx` commands directly.

If `{ARTIFACTS}/plan.md` exists:
- `mode=plan` -> ask reuse or regenerate; other modes -> regenerate.
- If `$ARGUMENTS` contains "skip plan" -> skip Phase 1.

### Pipeline visualization

Build a config JSON, write it to a temp file, and run.
Using a file avoids shell argument truncation for large configs:

```bash
cat > /tmp/pipeline-viz.json << 'VIZEOF'
<json>
```

| Phase | Agent (model) | Color | Role | Skip when |

| Phase | Agent (model) | Color | Role | Skip when |
|---:|---|---|---|---|
| 1 | ui-plan (opus) | purple | Sr Frontend Architect | never. PLAN_AGENTS>1 -> `parallel` array |
| 2.1 | ui-code scaffold (haiku) | gray | Type Foundation | mode=plan, or CODE_AGENTS=1 |
| 2.2 | work manifest | gray | - | mode=plan, or CODE_AGENTS=1 |
| 2.3 | ui-code (opus) | blue | Sr Frontend Engineer | mode=plan, or CODE_AGENTS=1 |
| 2.4 | integration check | gray | - | mode=plan. Dynamic: 1-3 parallel agents |
| 2.5 | lint + typecheck | gray | - | mode=plan, or CODE_AGENTS=1 |

**Note:** For i18n phase, use the `ui-i18n` skill after completing phases 1-2. For QA phases (Preview, Review, Fix), use the `ui-qa` skill.

Phase 1 parallel items (PLAN_AGENTS>1):

1. label: "Product Manager", role: "Product Manager"
2. label: "Sr. Frontend Architect", role: "Sr. Frontend Architect"
3. label: "Sr. QA Engineer", role: "Sr. QA Engineer"

Phase 2 parallel items (when CODE_AGENTS > 1):

- Phase 2.1 shows as: label: "Scaffold", color: "gray"
- Phase 2.3 parallel agents: labels from work_assignments role names, color: "blue"
  (e.g. "Infrastructure + Dashboard", "Broker Codes", "Affiliate Referral")

## State persistence

After each major phase completes, write/update `{ARTIFACTS}/state.json` using the Write tool:

```json
{
  "feature": "{FEATURE}",
  "figmaUrls": [{ "label": "...", "url": "https://figma.com/design/..." }],
  "mode": "{MODE}",
  "plan": {PLAN_AGENTS},
  "codeAgents": {CODE_AGENTS},
  "completedPhases": [],
  "timestamp": "{ISO8601}"
}
```

Persist state after these phases (append the phase to `completedPhases` and update `timestamp`): `1`, `2.5`.

Sub-phases 2.1-2.4 are internal - code generation is all-or-nothing (only checkpoint at 2.5).

## Resume flow

When `resume={feature}` is present in `$ARGUMENTS`:

1. **Load state** from `{ARTIFACTS}/state.json`. If missing, abort with error.
2. **Determine start phase**:
   - If `from=` specified -> start from that phase (map names: `plan`->1, `code`->2)
   - Otherwise -> first phase after the last entry in `completedPhases`
3. **Resolve mode**:
   - No mode override -> use `mode` from state
   - `mode=` in arguments -> override
  - If `from=` exceeds mode cutoff (e.g. `from=code` with `mode=plan`) -> auto-upgrade to `code`
4. **Show pipeline viz** with completed/skipped phases marked as `status: "skip"` in the viz config.
5. **Run phases** from the start point, persisting state after each.

## Phase 1 - Plan

Determine `PLAN_AGENTS`:

- If `plan=` explicitly specified -> use that value
- Else if Figma URL count >= 2 -> `PLAN_AGENTS=3`
- Else -> `PLAN_AGENTS=1`

### Single planner (PLAN_AGENTS=1)

Task `subagent_type="ui-plan"`: _"Analyse these Figma designs. URLs: {LIST}. Save plan to {ARTIFACTS}/plan.md"_

### Parallel planners (PLAN_AGENTS=3)

Fan out 3 plan agents in parallel, each writing to its own file:

| # | Role | Focus | Output |
|---:|---|---|---|
| 1 | Product Manager | Business requirements, user journey, acceptance criteria, content/i18n inventory, MVP priority | `{ARTIFACTS}/plan-1.md` |
| 2 | Sr. Frontend Architect | Component tree +  discovery, data/state layer, file paths, responsive, complexity assessment | `{ARTIFACTS}/plan-2.md` |
| 3 | Sr. QA Engineer | Verify /i18n from plans 1+2, AC -> test scenarios, pre-computed interaction test journeys | `{ARTIFACTS}/plan-3.md` |

Each gets the standard ui-plan prompt plus a role-specific suffix:

**Plan-1 (Product Manager):**

> You are the **Product Manager** planner. Save to `{ARTIFACTS}/plan-1.md`.
> Focus exclusively on:
> (1) Business requirements - what is this feature, who uses it, what problem it solves.
> (2) User journey - step-by-step flows through each page.
> (3) Acceptance criteria - bulleted "done" conditions.
> (4) Content inventory - every label, heading, button text, empty state message in the design -> proposed i18n key. Read `common.json` first.
> (5) MVP priority - which pages are critical vs nice-to-have.
> Perform Steps 1, 1.5, and 3 only. Do NOT produce component trees, data layer plans, or complexity assessments.

**Plan-2 (Sr. Frontend Architect):**

> You are the **Sr. Frontend Architect** planner. Save to `{ARTIFACTS}/plan-2.md`.
> Focus exclusively on:
> (1)  component discovery (Steps 2a-2c) with full component tree, exact props, import paths.
> (2) Data & state layer (Step 4): domain module design, API endpoints, mock data inventory.
> (3) File structure (Step 6): exact paths for every file.
> (4) Responsive breakpoints (Step 5).
> (5) **Complexity Assessment (Step 7)** - REQUIRED.
> Include the `work_assignments` block with concrete file-to-agent mapping.
> Perform Steps 1, 2, 4, 5, 6, and 7.

**Plan-3 (Sr. QA Engineer):**

> You are the **Sr. QA Engineer** planner. Save to `{ARTIFACTS}/plan-3.md`.
> Focus exclusively on verification and test design:
> (1) Verify every planned reusable component exists in current project paths (`ls apps/evm/src/components` and `ls apps/evm/src/containers`).
> (2) Verify every i18n key in plan-1.md exists in locale files.
> (3) Map each acceptance criterion from plan-1.md to 1-3 test scenarios (given/when/then).
> (4) Write pre-computed interaction test journeys as a fenced `interaction-journeys` JSON block for Phase 4.
> (5) Edge case inventory: empty, loading, error, responsive.
> Do NOT call Figma APIs. Work from {ARTIFACTS}/plan-1.md, {ARTIFACTS}/plan-2.md, and the codebase.

Planner 3 runs after planners 1 and 2 complete (it reads their outputs). Planners 1 and 2 run in parallel.

**Merge into `plan.md`** (orchestrator performs directly):

1. `{ARTIFACTS}/plan-2.md` (architect) = structural skeleton
2. Overlay from `{ARTIFACTS}/plan-1.md`: acceptance criteria section, i18n inventory
3. Apply `{ARTIFACTS}/plan-3.md` corrections: remove non-existent  components, fix non-existent i18n keys
4. Append `{ARTIFACTS}/plan-3.md`'s `interaction-journeys` block verbatim
5. Write merged `{ARTIFACTS}/plan.md` **preserve original plan-1.md, plan-2.md, plan-3.md - do NOT delete**
6. Parse complexity: `grep 'recommended_agents:' {ARTIFACTS}/plan.md`

**After Phase 1:** Update state: append `"1"` to `completedPhases`. Present summary (feature name, component tree,  components, file paths).

- `mode=plan` -> ask approval, then stop
- Other modes -> proceed directly

## Phase 2 - Code

### Dynamic agent allocation

After Phase 1, extract the recommended agent count from the merged plan:

```bash
CODE_AGENTS=$(grep 'recommended_agents:' {ARTIFACTS}/plan.md | head -1 | grep -o '[0-9]')
CODE_AGENTS=${CODE_AGENTS:-1}
```

### 1 agent (simple) - default

Standard single-agent dispatch. Task `subagent_type="ui-code"`.
Read `{ARTIFACTS}/plan.md` first and include key decisions ( props, interactions, responsive) in the prompt.

_"Implement the React components. Figma URLs: {LIST}. Plan: {ARTIFACTS}/plan.md. Feature: {FEATURE}. Write components to apps/evm/src/pages/{FEATURE}/components/. Write domain module (including mock.ts) to apps/evm/src/clients/api/{FEATURE}/. Write route file(s) to apps/evm/src/pages/{FEATURE}/index.tsx and register in apps/evm/src/App/Routes/index.tsx. Write locale file to apps/evm/src/libs/translations/translations/en.json. Read ALL reference files in .claude/references/ before writing code."_

### 2+ agents -> Scaffold -> Parallel -> Integrate

The old sequential pattern (Agent A finishes -> Agent B starts) wastes time.
The new pattern runs all agents simultaneously by first writing the shared type foundation (scaffold),
then fanning out independent agents that only import from the scaffold.

#### Phase 2.1 - Scaffold (CODE_AGENTS > 1)

Write the type foundation that all agents import from.
Parse the plan's `scaffold:` block for the file list.
Task `subagent_type="ui-code"`, model: haiku:

> Write ONLY the scaffold files for {FEATURE}. Plan: {ARTIFACTS}/plan.md.
> Scaffold files: {file list from scaffold.files in plan.md}
> These are the shared types, barrel exports, and shared components that all parallel agents will import. Write complete implementations - NOT stubs. Read the plan for all type definitions.

This step is fast (~1 min) because the plan already specifies all types and interfaces.

#### Phase 2.2 - Work manifest (CODE_AGENTS > 1)

After scaffold completes, the orchestrator writes `{ARTIFACTS}/work-manifest.md`:

1. List scaffold files written
2. For each agent, list: role name, file list (from `work_assignments` in plan.md)
3. Cross-check: every component in the plan's Step 2C component tree must appear in exactly one agent scope
   (scaffold or work_assignments). Any orphan (component in tree but not assigned) ->
   assign to the nearest agent before dispatching parallel agents.

This manifest is the single source of truth for what each agent owns.
After parallel agents complete, use it to verify all files were actually written.

#### Phase 2.3 - Parallel code agents (all run simultaneously)

Fan out ALL code agents in a **single message** with multiple Task calls. Each agent gets the base ui-code prompt plus:

> Your assignment is Code Agent (X) ({role from work_assignments}).
> Scaffold files already exist: {scaffold file list}
> Other agents are writing these files in parallel: {all other agents' file lists}
> You may import from any of these by name - the exports will exist after integration.
> Write ONLY these files (this agent's file list from work_assignments)
> Read all reference files in `.claude/references/` before writing code.

All agents run simultaneously. No agent waits for another agent - they only depend on the scaffold files written in Phase 2.1.

#### Phase 2.4 - Integration check (CODE_AGENTS > 1)

After all agents complete, run typecheck:

```bash
yarn typecheck
```

Fix cross-agent issues:

- **Missing exports**: Agent A imports `FooComponent` from Agent B but the export name is `Foo`
- **Type mismatches**: Agent A expects `onSubmit: (data: FormData) => void` but Agent B exports `onSubmit: (data: BrokerCode) => void`
- **Missing files**: An agent referenced a scaffold component that wasn't written

Max 2 iterations. If still failing, log remaining errors for manual review.

#### Phase 2.5 - Validate

Run validation checks:

```bash
yarn lint && yarn test --watch=false
```

Fix errors inline. Update state: append `"2.5"` to `completedPhases`.

**After Phase 2:** Present summary and suggest running `ui-i18n` for i18n phase:
> "Phases 1-2 complete. Run `/ui-i18n {FEATURE}` to add internationalization, then `/ui-qa {FEATURE}` for QA phases."




## Explicitly removed

- No `ui-api-spec` phase/sub-agent
- No deploy phase
- No `ui-deploy` sub-agent
- No commit/PR/deploy automation in this skill
- **No i18n phase (3)** - use `ui-i18n` skill instead
- **No QA phases (4-6)** - use `ui-qa` skill instead

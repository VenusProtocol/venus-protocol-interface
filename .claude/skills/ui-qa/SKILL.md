---
name: ui-qa
description: QA pipeline for UI features developed with ui-develop. Runs preview, design review, and auto-fix phases. Automatically reads artifacts from `.ui-develop/ui-develop-{FEATURE}/` directory. Supports auto-detection of feature name.
---

Orchestrate QA phases (Preview, Review, Fix) for UI features. This skill reads existing artifacts
from the `ui-develop` pipeline and executes phases 4-6.

**This skill covers phases 4-6 (Preview, Review, Fix). For development phases (Plan, Code, i18n), use the `ui-develop` skill.**

## Setup

Extract from `$ARGUMENTS`:

- **feature** - feature name (e.g. `convert`, `help-center`) - **optional, auto-detected if not provided**
- **qa=** - override QA reviewers count (default: **auto** from plan complexity)
- **from={phase}** - start from this phase. Accepts: `preview` (4), `review` (5), `fix` (6)
- **skip={phase}** - skip specific phase(s). Accepts: `preview`, `review`, `fix`
- Extra instructions (e.g. "skip preview", "qa=2")

### Feature name auto-detection

If `feature` is not provided in `$ARGUMENTS`, the skill automatically detects it:

1. **Scan artifacts directory**: List all `ui-develop-*` directories in `.ui-develop/`
2. **Filter valid features**: Check each directory for `plan.md` and `state.json`
3. **Selection logic**:
   - If exactly 1 feature found -> use it automatically
   - If multiple features found -> **list all features with timestamps and ask user to choose**
   - If no features found -> abort with error

**Implementation:**

```bash
# List all feature directories
FEATURES=$(ls -d .ui-develop/ui-develop-*/ 2>/dev/null | sed 's|.ui-develop/ui-develop-||' | sed 's|/$||')

# For each feature, check if plan.md exists and extract timestamp from state.json
# If multiple features found, display list and prompt user selection
```

**When multiple features are found**, display them in a numbered list with timestamps:

```
Multiple features found:
1. yield-plus (2026-03-10T00:02:00Z)
2. convert (2026-03-09T15:30:00Z)
3. help-center (2026-03-08T10:15:00Z)

Please select a feature (1-3) or provide feature name:
```

If `feature` is explicitly provided, use it directly (skip auto-detection).

### Artifacts directory

All artifacts are read from:

```txt
ARTIFACTS=.ui-develop/ui-develop-{FEATURE}
```

The skill automatically reads:
- `{ARTIFACTS}/plan.md` - for feature details and Figma URLs
- `{ARTIFACTS}/state.json` - for previous state (if exists)
- `{ARTIFACTS}/` - for existing screenshots and reviews

### Setup steps

1. **Extract or detect feature name**:
   - If provided in `$ARGUMENTS` -> use it
   - Otherwise -> run auto-detection logic above
2. **Verify artifacts exist**:
   - Check `{ARTIFACTS}/plan.md` exists, abort if missing with: "Feature '{FEATURE}' not found. Run ui-develop first."
   - Load `{ARTIFACTS}/state.json` if exists
3. **Extract Figma URLs** from `plan.md`:
   ```bash
   grep -i 'figma.com' {ARTIFACTS}/plan.md | head -5
   ```
4. **Determine start phase**:
   - If `from=` specified -> use that phase (map: `preview`->4, `review`->5, `fix`->6)
   - Else if `state.json` exists -> check `completedPhases`, start from next phase after 3
   - Else -> start from Phase 4 (Preview)

### Pipeline visualization

Build a config JSON, write it to a temp file, and run.
Using a file avoids shell argument truncation for large configs:

```bash
cat > /tmp/pipeline-viz.json << 'VIZEOF'
<json>
```

| Phase | Agent (model) | Color | Role | Skip when |
|---:|---|---|---|---|
| 4 | ui-preview (sonnet) | orange | Preview + QA Tester | skip=preview, or screenshots exist |
| 5 | ui-qa-verify (opus) | yellow | Sr UI/UX Designer & QA | skip=review, or review.md exists |
| 6 | ui-qa-fix (sonnet) | red | Fix + Verify Engineer | skip=fix, or no Must Fix/Should Fix items |

Phase 5 parallel items (when QA_AGENTS > 1):

1. label: "Designer", role: "Design System Owner"
2. label: "QA Engineer", role: "Sr. QA Engineer"
3. label: "A11y Auditor", role: "Accessibility Auditor" (only when QA_AGENTS=3)

## State persistence

After each phase completes, update `{ARTIFACTS}/state.json`:

```json
{
  "feature": "{FEATURE}",
  "figmaUrls": [{ "label": "...", "url": "https://figma.com/design/..." }],
  "qa": {QA_AGENTS},
  "completedPhases": ["4", "5", "6"],
  "timestamp": "{ISO8601}"
}
```

Persist state after phases: `4`, `5`, `6`.

**Note:** This skill reads and updates the same `state.json` file created by `ui-develop`, ensuring continuity.

## Phase 4 - Preview

**Skip if:**
- `skip=preview` in arguments
- `{ARTIFACTS}/` already contains screenshot files (check for `*.png` or `*.jpg`) and arguments don't contain "force preview"

**Otherwise:**

1. **Extract Figma URLs** from `{ARTIFACTS}/plan.md`:
   ```bash
   grep -oE 'https://[^[:space:]]*figma[^[:space:]]*' {ARTIFACTS}/plan.md | sort -u
   ```

2. **Task `subagent_type="ui-preview"`**:
   > Take screenshots. Figma URLs: {LIST}. Feature: {FEATURE}. Artifacts directory: {ARTIFACTS}. Save screenshots to {ARTIFACTS}/.

3. **Update state**: append `"4"` to `completedPhases` in `{ARTIFACTS}/state.json`.

## Phase 5 - Design Review

**Skip if:**
- `skip=review` in arguments
- `{ARTIFACTS}/review.md` already exists and arguments don't contain "force review"

**Otherwise:**

### Determine QA_AGENTS

- If `qa=` explicitly specified -> use that value
- Else extract from plan complexity:
  ```bash
  COMPLEXITY=$(grep -i 'score:' {ARTIFACTS}/plan.md | head -1 | awk '{print $NF}' | tr -d '`' | tr '[:upper:]' '[:lower:]')
  ```
  - `simple` -> QA_AGENTS=1
  - `moderate` -> QA_AGENTS=2
  - `complex` -> QA_AGENTS=3
- If complexity not found -> default to 1

### Single reviewer (QA_AGENTS=1)

**Task `subagent_type="ui-qa-verify"`**:
> Review components against Figma. URLs: {LIST}. Feature: {FEATURE}. Artifacts directory: {ARTIFACTS}. Plan at {ARTIFACTS}/plan.md. Screenshots in {ARTIFACTS}/. Write to {ARTIFACTS}/review.md.

### Parallel reviewers (QA_AGENTS >= 2)

Fan out QA_AGENTS review agents in parallel. Each writes to `{ARTIFACTS}/review-{i}.md`.

| # | Role | Scope | When |
|---:|---|---|---|
| 1 | Designer (Design System Owner) | Visual fidelity, design token compliance, interaction states, responsive, cross-page consistency | QA_AGENTS >= 2 |
| 2 | Sr. QA Engineer | AC verification, interactive wiring ($A2), mental simulation ($A1), assertion results ($A3) | QA_AGENTS >= 2 |
| 3 | Accessibility & Edge Cases | ARIA, keyboard nav, screen reader, error/empty/loading states, boundary values, performance | QA_AGENTS = 3 |

**QA_AGENTS=2**: Dispatch Review-1 and Review-2 only. Review-2 also covers basic a11y (ARIA on interactive elements, heading hierarchy) as part of Domain C. No separate A11y reviewer.

**QA_AGENTS=3**: Dispatch all three. Review-3 performs deep a11y audit.

Each gets the standard review prompt plus a role-specific suffix:

**Review-1 (Designer):**

> You are a **Figma Design System Owner** reviewing for visual fidelity. Write to `{ARTIFACTS}/review-1.md`.
> Focus on: pixel-level comparison with Figma, design token compliance
> (every color/typography/spacing from tokens), interaction design
> (hover/active/focus match Figma annotations), responsive
> (mobile screenshots vs mobile Figma), design consistency across pages.
> Perform Domain B + Domain C from the review checklist, DO NOT perform Domain A.
> Your reviewer role is: Designer reviewer.

**Review-2 (Sr. QA Engineer):**

> You are a **Sr. QA Engineer** reviewing for functional correctness. Write to `{ARTIFACTS}/review-2.md`.
> Focus on: Read the plan's acceptance criteria and verify each is met.
> Interactive wiring (Domain A2).
> Mental simulation (Domain A1): trace data flow for forms, computed values, multi-step flows.
> Assertion results (Domain A3): read PASS/FAIL/TIMEOUT screenshots.
> Cross-page functional consistency (Domain C).
> Mock-first code is intentional - do NOT flag hardcoded constants or unwired hooks.
> (When QA_AGENTS>=2, add:). Also check basic accessibility:
> ARIA attributes on interactive elements, heading hierarchy,
> and keyboard-focusable controls.
> Your reviewer role is: QA Engineer reviewer.

**Review-3 (Accessibility & Edge Cases) - only when QA_AGENTS=3:**

> You are an **Accessibility Auditor**. Write to `{ARTIFACTS}/review-3.md`.
> Focus on: ARIA attributes, keyboard navigation, screen reader
> (alt text, heading hierarchy, landmarks), error states, empty states,
> loading states, boundary values (long text, zero, special chars),
> performance (re-render triggers, DOM size).
> Verify  components exist before suggesting them. Do not duplicate review-1 or review-2 findings.
> Your reviewer role is: A11y reviewer.

**Merge into `review.md`:** QA findings on wiring (Domain A) take precedence +
Designer findings on tokens (Domain B) + A11y findings are additive.
Deduplicate by file:line, keep highest severity.

**Preserve original review files** (`review-1.md`, `review-2.md`, and `review-3.md` if present) - do NOT delete.

**Update state**: append `"5"` to `completedPhases` in `{ARTIFACTS}/state.json`.

## Phase 6 - Auto-fix

**Skip if:**
- `skip=fix` in arguments
- `{ARTIFACTS}/review.md` doesn't exist
- `{ARTIFACTS}/review.md` contains no "Must Fix" or "Should Fix" items

**Otherwise:**

1. **Check review for issues**:
   ```bash
   grep -iE '(must fix|should fix)' {ARTIFACTS}/review.md || echo "No fixes needed"
   ```

2. **Task `subagent_type="ui-qa-fix"`**:
   > Apply QA review fixes. Feature: {FEATURE}. Artifacts directory: {ARTIFACTS}. Review at {ARTIFACTS}/review.md.

3. **Update state**: append `"6"` to `completedPhases` in `{ARTIFACTS}/state.json`.

## Usage examples

```bash
# Auto-detect feature (uses most recent)
/ui-qa

# Specify feature explicitly
/ui-qa convert

# Skip preview, only review and fix
/ui-qa convert skip=preview

# Force 3 reviewers regardless of complexity
/ui-qa convert qa=3

# Start from review phase only
/ui-qa convert from=review

# Only run preview
/ui-qa convert from=preview skip=review skip=fix
```

## Error handling

- **Missing plan.md**: Abort with error: "Feature '{FEATURE}' not found. Run ui-develop first."
- **Missing screenshots** (Phase 5): Warn but continue (reviewer can note missing screenshots)
- **Review merge conflicts**: Keep all findings, deduplicate by file:line
- **No features found** (auto-detection): Abort with error: "No features found in .ui-develop/. Run ui-develop first."
- **Multiple features found**: Display list and prompt user to select (see auto-detection section above)
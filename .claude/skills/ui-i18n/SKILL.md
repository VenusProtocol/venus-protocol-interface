---
name: ui-i18n
description: i18n pipeline for UI features developed with ui-develop. Adds internationalization to components with hardcoded strings. Automatically reads artifacts from `.ui-develop/ui-develop-{FEATURE}/` directory. Supports auto-detection of feature name.
---

Orchestrate i18n phase for UI features. This skill reads existing artifacts
from the `ui-develop` pipeline and executes phase 3 (i18n).

**This skill covers phase 3 (i18n). For development phases (Plan, Code), use the `ui-develop` skill. For QA phases (Preview, Review, Fix), use the `ui-qa` skill.**

## Setup

Extract from `$ARGUMENTS`:

- **feature** - feature name (e.g. `convert`, `help-center`) - **optional, auto-detected if not provided**
- Extra instructions (e.g. "force update")

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
- `{ARTIFACTS}/plan.md` - for feature details and i18n key inventory
- `{ARTIFACTS}/state.json` - for previous state (if exists)

### Setup steps

1. **Extract or detect feature name**:
   - If provided in `$ARGUMENTS` -> use it
   - Otherwise -> run auto-detection logic above
2. **Verify artifacts exist**:
   - Check `{ARTIFACTS}/plan.md` exists, abort if missing with: "Feature '{FEATURE}' not found. Run ui-develop first."
   - Load `{ARTIFACTS}/state.json` if exists
3. **Check if i18n already applied**:
   - Scan component files for `t()` calls
   - Check if locale file exists with feature keys
   - If both exist and arguments don't contain "force" -> skip with message

### Pipeline visualization

Build a config JSON, write it to a temp file, and run.
Using a file avoids shell argument truncation for large configs:

```bash
cat > /tmp/pipeline-viz.json << 'VIZEOF'
<json>
```

| Phase | Agent (model) | Color | Role | Skip when |
|---:|---|---|---|---|
| 3 | ui-i18n (sonnet) | orange | i18n Engineer | i18n already applied |

## State persistence

After phase completes, update `{ARTIFACTS}/state.json`:

```json
{
  "feature": "{FEATURE}",
  "figmaUrls": [{ "label": "...", "url": "https://figma.com/design/..." }],
  "completedPhases": ["3"],
  "timestamp": "{ISO8601}"
}
```

Persist state after phase: `3`.

**Note:** This skill reads and updates the same `state.json` file created by `ui-develop`, ensuring continuity.

## Phase 3 - i18n

### Scope and Safety

**Important:** This phase only processes files within the feature scope to avoid affecting historical code:

- **Target paths** (only these are modified):
  - `apps/evm/src/pages/{FEATURE}/` - feature-specific pages
  - Components referenced in `{ARTIFACTS}/plan.md` that are part of this feature
  - New components created in Phase 2

- **Excluded paths** (never touched):
  - Existing shared components in `apps/evm/src/components/`
  - Existing containers in `apps/evm/src/containers/`
  - Any files outside the feature directory
  - Historical code in other features

### Analysis Process

1. **Read plan and identify scope**:
   - Read `{ARTIFACTS}/plan.md` for i18n key inventory (pre-planned in Phase 1)
   - Get component file list from plan (only feature-specific files)
   - Verify files exist in `apps/evm/src/pages/{FEATURE}/`

2. **Check if already i18n'd**:
   - Scan target files for existing `t()` calls
   - Check if locale file has feature keys
   - If both exist and no "force" flag -> skip with message

3. **Identify strings to translate** (only in target files):
   - **Include**: JSX text content, `placeholder`, `label`, `title`, `helperText`, tooltips, accessibility labels
   - **Skip**: CSS class names, enum/constants, token symbols, wallet addresses, technical identifiers

### Execution

**Skip if:**
- Components already have `t()` calls and locale file exists (unless "force" in arguments)

**Otherwise:**

1. **Task `subagent_type="ui-i18n"`**:
   > Add i18n to components. Feature: {FEATURE}. Artifacts directory: {ARTIFACTS}. Plan at {ARTIFACTS}/plan.md. 
   > **ONLY process files in apps/evm/src/pages/{FEATURE}/ and components listed in plan.md.**
   > **DO NOT modify any existing shared components or files outside the feature directory.**
   > Update components and add keys to apps/evm/src/libs/translations/translations/en.json.

2. **Update state**: append `"3"` to `completedPhases` in `{ARTIFACTS}/state.json`.

**After Phase 3:** Present summary and suggest running `ui-qa` for QA phases:
> "Phase 3 (i18n) complete. Run `/ui-qa {FEATURE}` to continue with Preview, Review, and Fix phases."

## Usage examples

```bash
# Auto-detect feature (uses most recent)
/ui-i18n

# Specify feature explicitly
/ui-i18n convert

# Force update even if i18n already applied
/ui-i18n convert force
```

## Error handling

- **Missing plan.md**: Abort with error: "Feature '{FEATURE}' not found. Run ui-develop first."
- **No features found** (auto-detection): Abort with error: "No features found in .ui-develop/. Run ui-develop first."
- **Multiple features found**: Display list and prompt user to select (see auto-detection section above)
- **Components not found**: Warn but continue (agent will handle missing files)

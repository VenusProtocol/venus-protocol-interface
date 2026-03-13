# Venus EVM Design System Reference

All styling uses project design tokens first - avoid raw hex/rgb and avoid ad-hoc typography sizing when a token exists.

## Typography

Source of truth: `packages/ui/src/theme.css` and `packages/ui/src/theme.ts`

| Class | Size / Weight | Use for |
|---|---|---|
| `text-h2` | 72px / 600 | Hero-level numbers/titles |
| `text-h3` | 60px / 600 | Large section headlines |
| `text-h4` | 48px / 600 | Panel/metric highlights |
| `text-h5` | 40px / 600 | Landing stat highlights |
| `text-h6` | 32px / 600 | Section titles |
| `text-h7` | 28px / 600 | Compact section titles |
| `text-p1s` | 24px / 600 | Strong lead text |
| `text-p1r` | 24px / 400 | Regular lead text |
| `text-p2s` | 20px / 600 | Mid-size emphasized text |
| `text-p2r` | 20px / 400 | Mid-size regular text |
| `text-p3s` | 16px / 600 | Emphasized body/labels |
| `text-p3r` | 16px / 400 | Regular body (large) |
| `text-b1s` | 14px / 600 | Label/value emphasis |
| `text-b1r` | 14px / 400 | Primary body text |
| `text-b2s` | 12px / 600 | Small emphasized labels |
| `text-b2r` | 12px / 400 | Secondary/support text |
| `text-b3s` | 10px / 600 | Tiny emphasized labels |
| `text-b3r` | 10px / 400 | Tiny helper text |

## Semantic heading tags - critical rule

Unlike some other systems, this repo does not globally auto-map `<h1>`...`<h4>` to a `text-h*` scale.  
You should keep semantic tags for accessibility and apply typography tokens explicitly.

### Rule 1 - Semantic first, style explicitly:

```tsx
// Correct
<h2 className="text-h6 text-white">Section Title</h2>
<h3 className="text-p2s text-light-grey">Card Title</h3>
```

### Rule 2 - Avoid conflicting text-size stacks:

```tsx
// Wrong - two competing size tokens
<h2 className="text-h6 text-p2s">Section Title</h2>

// Correct - one size token
<h2 className="text-h6">Section Title</h2>
```

### Rule 3 - Non-semantic heading-like text is allowed:

```tsx
// Correct - visual heading without semantic heading meaning
<p className="text-h6 text-white">Widget Title</p>
```

### Rule 4 - Responsive typography can stack per breakpoint:

```tsx
// Correct
<h2 className="text-p2s md:text-p1s lg:text-h6">Responsive Title</h2>
```

### Choosing the right token - common mapping

| Visual target in Figma | Use |
|---|---|
| 12px regular | `text-b2r` |
| 12px emphasized | `text-b2s` |
| 14px regular | `text-b1r` |
| 14px emphasized | `text-b1s` |
| 16px regular | `text-p3r` |
| 16px emphasized | `text-p3s` |

- Action links and compact controls usually map to `text-b2s` or `text-b1s`
- Long body content usually maps to `text-b1r` or `text-p3r`
- Section titles should use `text-h6` / `text-h7` / `text-p2s` based on density

### Blocklisted for new code when a design token exists

`text-[...px]`, `leading-[...px]`, `font-[...]`, `font-bold`, `font-semibold`, `leading-none`

Legacy files may still contain these. For new UI or touched lines, prefer tokenized classes above.

## Color tokens

Source of truth: `packages/ui/src/theme.css`

### Backgrounds

Primary surfaces:

- `bg-background` - app/page background
- `bg-background-hover` - hover surface state
- `bg-background-active` - active/deeper surface state
- `bg-background-disabled` - disabled surface

Secondary surfaces:

- `bg-cards` - card containers (legacy but still widely used)
- `bg-lightGrey` - elevated sub-surface (legacy camelCase token)
- `bg-dark-blue`, `bg-dark-blue-hover`, `bg-dark-blue-active` - dark panel and control surfaces

Status / action fills:

- `bg-blue`, `bg-blue-hover`, `bg-blue-active`
- `bg-green`, `bg-green-hover`, `bg-green-active`
- `bg-red`, `bg-red-hover`, `bg-red-active`
- `bg-orange`, `bg-orange-hover`, `bg-orange-active`
- `bg-yellow`, `bg-yellow-hover`, `bg-yellow-active`

### Text colors

- `text-white` - primary readable text on dark surfaces
- `text-grey`, `text-light-grey`, `text-lightGrey` - secondary/helper text (both naming families exist)
- `text-blue`, `text-green`, `text-red`, `text-orange`, `text-yellow` - status/emphasis text

### Borders

- `border-lightGrey`, `border-light-grey` - common separators/strokes
- `border-cards`, `border-background`, `border-blue`, `border-dark-blue-active` - contextual borders

### Rules

- Never introduce raw hex for standard UI surfaces/text if a token exists.
- Follow the local naming family of the file (`lightGrey` vs `light-grey`) instead of mixing both in one component.
- For interactive states, always pair base + hover + active tokens.

## Reading tokens in code

### Preferred: utility classes in JSX

```tsx
<div className="bg-background text-white border border-lightGrey" />
```

### Runtime token access (`@venusprotocol/ui`)

```ts
import { theme } from '@venusprotocol/ui';

const axisColor = theme.colors.lightGrey;
const pageBg = theme.colors.background;
```

Use this pattern in chart configs, computed styles, and theme-aware helpers.

### MUI / Emotion layer

Source of truth: `apps/evm/src/App/MuiThemeProvider/muiTheme.ts`

Use:

- `theme.palette.background.default` (`theme.colors.background`)
- `theme.palette.background.paper` (`theme.colors.cards`)
- `theme.palette.interactive.*` for success/error/warning/primary interaction colors
- `theme.typography.*` for Emotion-based typography styles

## Spacing & sizing - use utility scale first

The project spacing scale uses 0.25rem increments from the UI theme (`--spacing: 0.25rem`).

| px | Utility | px | Utility |
|---|---|---|---|
| 4px | `1` | 40px | `10` |
| 8px | `2` | 48px | `12` |
| 12px | `3` | 56px | `14` |
| 16px | `4` | 64px | `16` |
| 20px | `5` | 80px | `20` |
| 24px | `6` | 96px | `24` |
| 32px | `8` | 120px | `30` |

### Radius mapping

| Arbitrary (avoid) | Utility (preferred) |
|---|---|
| `rounded-[8px]` | `rounded-lg` |
| `rounded-[12px]` | `rounded-xl` |
| `rounded-[16px]` | `rounded-2xl` |
| `rounded-[9999px]` | `rounded-full` |

### When arbitrary values are acceptable

- Large layout widths/heights with no clean utility mapping (`max-w-[1176px]`, `h-[70vh]`)
- Visual effects that are intentionally non-tokenized (hero-only decorative gradients)

## Component selection patterns

When implementing UI that includes dropdown/select controls, identify the selection type first:

### Dropdown selection type identification

**If the dropdown selects tokens (cryptocurrency tokens):**
- **Single token selector (button only, no input field)** → Use `SelectTokenField`
  - **Import:** `import { SelectTokenField } from 'pages/Market/OperationForm/BoostForm/SelectTokenField';`
  - **Props:** `token`, `onButtonClick`, `isActive`, `label`, `disabled`
  - **Pattern:** Token selector button that opens a token list modal

- **Single token selector with input field** → Use `SelectTokenTextField`
  - **Import:** `import { SelectTokenTextField } from 'components';`
  - **Props:** `selectedToken`, `onChangeSelectedToken`, `tokenBalances`, `value`, etc.
  - **Pattern:** Token selector button + amount input field combined

**If the dropdown selects non-token items (categories, options, settings, etc.):**
- Use `Select` from `components`
  - **Import:** `import { Select } from 'components';`
  - **Props:** `value`, `options`, `onChange`, `variant`, `size`
  - **Pattern:** Generic dropdown for any non-token selection

### Component discovery priority

Before creating new selection components:
1. **Identify selection type:** Is it selecting tokens or non-token items?
2. **For token selections:**
   - Check `apps/evm/src/components/` for generic token selection components (e.g., `SelectTokenTextField`)
   - Check existing page implementations for reusable token selector patterns (e.g., `SelectTokenField` in BoostForm)
3. **For non-token selections:** Use `Select` from `components`

## Component style constraints

### `@venusprotocol/ui` usage

Prefer imports from `@venusprotocol/ui` when available:

- `cn`
- `theme`
- `Button`, `ButtonWrapper`, `PrimaryButton`, `SecondaryButton`, etc.
- `Spinner`

### Button variants (project-native)

`Button` supports:

- `variant`: `primary | secondary | tertiary | quaternary | quinary | senary | text`
- `size`: `xs | sm | md`
- `rounded`: `boolean`
- `active`: `boolean`
- `loading`: `boolean` (via `Button`)

Use variant classes and tokenized states; do not re-implement button colors ad hoc.

### Class merge

Always use `cn(...)` for conditional class composition to avoid conflicting text-size tokens and state classes.

## Interaction state rules

- Buttons/controls should define explicit hover and active classes from token families.
- Disabled state must use tokenized disabled styles (`disabled:bg-*`, `disabled:border-*`, `disabled:text-*`).
- Do not depend on opacity-only disabled behavior unless the component design explicitly says so.

## Text hierarchy patterns

```tsx
// Section title
<h2 className="text-p2s md:text-p1s lg:text-h6 text-white">Safety</h2>

// Body copy
<p className="text-b1r text-grey lg:text-p3r">Body content</p>

// Stat value + label
<p className="text-h5 lg:text-h4 text-white">{value}</p>
<span className="text-b2r text-light-grey">Security score</span>

// Card title
<p className="text-h7 text-white">Card Title</p>

// Helper text
<span className="text-b3r text-light-grey">Last updated: 5m ago</span>
```

## Background composition patterns

```tsx
// Page base
<section className="bg-background text-white" />

// Card surface
<div className="bg-cards border border-lightGrey rounded-xl" />

// Interactive row
<button className="bg-dark-blue-active hover:bg-dark-blue-hover active:bg-dark-blue-active border border-dark-blue-active" />
```

## Migration note (important)

This repo currently mixes two naming families:

- Kebab-case newer tokens: `light-grey`, `dark-blue`, `background-active`, etc.
- Legacy camelCase tokens: `lightGrey`, `darkBlue`, `cards`, etc.

For edits, follow the local file convention and avoid mixing both styles inside one component unless required.

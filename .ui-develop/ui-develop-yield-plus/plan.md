# Yield+ Page Implementation Plan

## 1. Design Overview

The Yield+ page is a leveraged yield trading interface with a two-column layout at desktop. It allows users to open long/short positions on token pairs with collateral, displaying a candlestick price chart and position management.

### Layout Structure (1440px frame)

- **Header**: Venus global nav with "Yield+" tab active (already styled as a pill/badge in the nav)
- **Left column** (845px): Token pair selector + stats bar, candlestick chart (TradingView embed), Positions/Transactions tabs
- **Right column** (411px): Info banner, Position/Collateral form panel

### Key Visual Details

| Element | Token | Notes |
|---|---|---|
| Page background | `bg-background` | Dark app background |
| Left column gap | 24px between sections | `gap-6` |
| Right panel | `bg-cards` with `rounded-xl` | Card surface |
| Long pill | Green bg `bg-green` text dark | Active toggle for Long |
| Short pill | Red bg `bg-red` text dark | Active toggle for Short |
| Stats row text | `text-b2r text-grey` labels, `text-b1s text-white` values, `text-green` for APY | |
| Pair price | `text-p3s text-white` with `text-green` for change % | |
| Tab underline | `bg-blue` 3px, matching existing `Tabs` variant="secondary" | |
| Chart area | 845x386px rounded rectangle - TradingView widget embed | |
| Right panel tabs | "Position" / "Collateral" - underlined tabs | |
| Slider | Radix slider for leverage ratio (0%-100%) - reuse `Slider` component | |
| LTV bar | Progress bar with green fill + red mark, labels "LTV" + "LT" - reuse `ProgressBar`/`LabeledProgressBar` | |
| Health factor | `HealthFactorPill` with value 8.4, "Safe" label | |
| Open button | Full-width primary button `bg-blue` | |
| Banner | Dismissible info banner at top of right column with illustration | |

## 2. Component Decisions Table

| UI Block | Component | Reuse / New | Props/Notes |
|---|---|---|---|
| Token pair selector | `TokenPairSelector` | **New** | Long/Short toggle + two Select dropdowns with TokenIcon labels |
| Pair stats bar | `PairStatsBar` | **New** | Display-only: pair price, change%, long/short liquidity, supply/borrow APY |
| Candlestick chart | `TradingViewChart` | **New** | TradingView lightweight-charts widget embed. User requested "k-line view chart". No existing candlestick component in repo. Use `lightweight-charts` npm package. |
| Positions table | `PositionsTable` | **New** | Table or empty state with wallet disconnected message |
| Transactions table | `TransactionsTable` | **New** | Table or empty state |
| Position form panel | `PositionForm` | **New** | Collateral input, long/short token display, leverage slider, stats, Open button |
| Info banner | `YieldPlusBanner` | **New** | Dismissible banner with "What is Yield+?" text and illustration |
| Token select with icon | `Select` + `TokenIcon` | **Reuse** | Existing Select with custom label rendering TokenIcon + symbol |
| Tabs (Positions/Transactions) | `Tabs` | **Reuse** | variant="secondary" |
| Tabs (Position/Collateral) | `Tabs` | **Reuse** | variant="secondary" in right panel |
| Leverage slider | `Slider` | **Reuse** | 0-100 range, step=1 |
| LTV progress bar | `ProgressBar` | **Reuse** | With mark for liquidation threshold |
| Health factor pill | `HealthFactorPill` | **Reuse** | showLabel=true |
| Open button | `Button` (primary) | **Reuse** | Full-width, variant="primary" |
| Slippage settings | `SlippageSettings` | **New** | Small inline display: "Slippage tolerance 0.5%" + settings gear + "Price impact" |

## 2b. Component Tree

```
YieldPlusPage (page-specific, data-driven)
  +-- Page (shared, display-only)
  +-- div.flex (two-column layout)
  |   +-- div.left-column
  |   |   +-- TokenPairSelector (page-specific, local-state)
  |   |   |   +-- LongShortToggle (page-specific, local-state)
  |   |   |   +-- Select + TokenIcon (shared, reused) x2
  |   |   +-- PairStatsBar (page-specific, data-driven)
  |   |   |   +-- TokenIcon x2 (overlapping pair icons)
  |   |   +-- TradingViewChart (page-specific, data-driven)
  |   |   +-- Tabs variant="secondary" (shared, reused)
  |   |       +-- PositionsTable (page-specific, data-driven)
  |   |       +-- TransactionsTable (page-specific, data-driven)
  |   +-- div.right-column
  |       +-- YieldPlusBanner (page-specific, display-only)
  |       +-- Tabs variant="secondary" (shared, reused)
  |           +-- PositionForm (page-specific, local-state + data-driven)
  |           |   +-- Select + TokenIcon (collateral token)
  |           |   +-- TokenIconWithSymbol (long token display)
  |           |   +-- TokenIconWithSymbol (short token display)
  |           |   +-- Slider (leverage ratio)
  |           |   +-- ProgressBar (LTV bar with LT mark)
  |           |   +-- HealthFactorPill
  |           |   +-- Button (Open)
  |           |   +-- SlippageSettings
  |           +-- CollateralForm (page-specific, local-state + data-driven)
```

## 3. i18n Key Inventory

Target file: `apps/evm/src/libs/translations/translations/en.json`

```json
{
  "yieldPlus": {
    "title": "Yield+",
    "long": "Long",
    "short": "Short",
    "pairStats": {
      "longLiquidity": "Long liquidity",
      "shortLiquidity": "Short liquidity",
      "supplyApy": "{{token}} supply APY",
      "borrowApy": "{{token}} borrow APY"
    },
    "tabs": {
      "positions": "Positions",
      "transactions": "Transactions",
      "position": "Position",
      "collateral": "Collateral"
    },
    "banner": {
      "title": "What is Yield+,",
      "link": "How is works?"
    },
    "form": {
      "collateral": "Collateral",
      "available": "Available",
      "long": "Long",
      "short": "Short",
      "liqPrice": "Liq. price",
      "avgEnterPrice": "Avg. enter price",
      "netApy": "Net APY",
      "ltv": "LTV: {{value}}",
      "lt": "LT: {{value}}",
      "healthFactor": "Health factor",
      "open": "Open",
      "slippageTolerance": "Slippage tolerance",
      "priceImpact": "Price impact",
      "leverage": "{{value}}x"
    },
    "emptyState": {
      "walletDisconnected": "Wallet Disconnected",
      "noOpenPosition": "You do not have an open position yet"
    }
  }
}
```

Strings requiring interpolation: `pairStats.supplyApy`, `pairStats.borrowApy`, `form.ltv`, `form.lt`, `form.leverage`.

No `<Trans>` needed. No pluralization needed.

## 3.5. Interaction States Table

| Element | Default | Hover | Active/Focus | Disabled | Source |
|---|---|---|---|---|---|
| Long toggle | `bg-green text-background` | `bg-green-hover` | `bg-green-active` | N/A | Figma green pill |
| Short toggle | `bg-red text-background` | `bg-red-hover` | `bg-red-active` | N/A | Figma red pill |
| Token Select | `bg-dark-blue border-dark-blue-disabled/50` | `bg-dark-blue-hover` | `border-blue` | `bg-background-disabled` | Existing Select primary variant |
| Collateral input | `bg-dark-blue border-dark-blue-disabled/50` | `border-blue` | `border-blue` | grey text | Figma input field |
| Leverage Slider | `bg-blue` range, white thumb | thumb glow | N/A | grey track | Existing Slider |
| Open button | `bg-blue text-background` | `bg-blue-hover` | `bg-blue-active` | `bg-background-disabled text-grey` | Figma primary button |
| Tab (inactive) | `text-grey` | `text-white` | N/A | N/A | Existing Tabs secondary |
| Tab (active) | `text-white` + `bg-blue` underline | N/A | N/A | N/A | Existing Tabs secondary |
| Banner close | transparent | `text-white` | N/A | N/A | Figma X icon |

## 4. Data and State

### Query Hooks (new, in `clients/api/queries/yieldPlus/`)

| Hook | Purpose | Cache Key |
|---|---|---|
| `useGetYieldPlusPairs` | Fetch available long/short token pairs with liquidity and APY data | `GET_YIELD_PLUS_PAIRS` |
| `useGetYieldPlusPositions` | Fetch user open positions | `GET_YIELD_PLUS_POSITIONS` |
| `useGetYieldPlusTransactions` | Fetch user transaction history | `GET_YIELD_PLUS_TRANSACTIONS` |
| `useGetYieldPlusPairPrice` | Fetch price data for TradingView chart (OHLCV candles) | `GET_YIELD_PLUS_PAIR_PRICE` |

### Mutation Hooks (new, in `clients/api/mutations/`)

| Hook | Purpose | Invalidates |
|---|---|---|
| `useOpenYieldPlusPosition` | Open a new long/short position | `GET_YIELD_PLUS_POSITIONS`, `GET_TOKEN_BALANCES` |

### Local UI State

| State | Location | Type |
|---|---|---|
| Selected side (long/short) | `YieldPlusPage` | `'long' \| 'short'` |
| Selected long token | `YieldPlusPage` | `Token` |
| Selected short token | `YieldPlusPage` | `Token` |
| Collateral token + amount | `PositionForm` | `{ token: Token; amount: string }` |
| Leverage percentage | `PositionForm` | `number` (0-100) |
| Active left tab | `Tabs` state | `'positions' \| 'transactions'` |
| Active right tab | `Tabs` state | `'position' \| 'collateral'` |
| Banner dismissed | `YieldPlusBanner` | `boolean` (persist in localStorage) |

### FunctionKey additions

Add to `apps/evm/src/constants/functionKey.ts`:
```
GET_YIELD_PLUS_PAIRS
GET_YIELD_PLUS_POSITIONS
GET_YIELD_PLUS_TRANSACTIONS
GET_YIELD_PLUS_PAIR_PRICE
```

## 5. Responsive Design

| Element | Mobile (<768px) | Desktop (>=768px) |
|---|---|---|
| Two-column layout | Stack vertically, right panel below left | Side-by-side: left 845px, right 411px, 24px gap |
| Token pair selector | Full width, Long/Short toggles + selects stack | Inline row with toggles and selects |
| Chart | Full width, reduced height ~250px | 845x386px |
| Right panel | Full width below chart | Fixed 411px sidebar |
| Stats bar | Horizontal scroll or wrap | Single row |
| Positions/Transactions | Full width table with horizontal scroll | Full table |

## 6. Suggested File Paths

### Page files
- `apps/evm/src/pages/YieldPlus/index.tsx` -- main page component
- `apps/evm/src/pages/YieldPlus/components/TokenPairSelector/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/PairStatsBar/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/TradingViewChart/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/PositionsTable/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/TransactionsTable/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/PositionForm/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/CollateralForm/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/YieldPlusBanner/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/SlippageSettings/index.tsx`

### API files
- `apps/evm/src/clients/api/queries/yieldPlus/index.ts` -- fetch functions
- `apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPairs.ts`
- `apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPositions.ts`
- `apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusTransactions.ts`
- `apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPairPrice.ts`
- `apps/evm/src/clients/api/queries/yieldPlus/types.ts`
- `apps/evm/src/clients/api/mutations/useOpenYieldPlusPosition/index.ts`

### Modified existing files
- `apps/evm/src/constants/functionKey.ts` -- add new FunctionKey entries
- `apps/evm/src/constants/routing.ts` -- add `YIELD_PLUS = 'yield-plus'` to Subdirectory + routeSubdirectories
- `apps/evm/src/App/Routes/index.tsx` -- add YieldPlus lazy route
- `apps/evm/src/containers/Layout/NavBar/useMenuItems/index.tsx` -- add Yield+ menu item before "Others"
- `apps/evm/src/libs/translations/translations/en.json` -- add `yieldPlus.*` keys
- `apps/evm/src/hooks/useIsFeatureEnabled/index.tsx` -- add `yieldPlusRoute` feature flag (optional)

### New dependency
- `lightweight-charts` -- TradingView lightweight-charts for candlestick chart rendering (add to `apps/evm/package.json`)

## 7. Complexity Assessment

```complexity-assessment
routes: 1
complex_components: 2
total_components: 11
score: moderate
recommended_agents: 2
scaffold:
  files:
    - apps/evm/src/clients/api/queries/yieldPlus/types.ts
    - apps/evm/src/constants/functionKey.ts
    - apps/evm/src/constants/routing.ts
    - apps/evm/src/libs/translations/translations/en.json
work_assignments:
  agent_a:
    role: Infrastructure + Left Column
    files:
      - apps/evm/src/clients/api/queries/yieldPlus/index.ts
      - apps/evm/src/clients/api/queries/yieldPlus/types.ts
      - apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPairs.ts
      - apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPairPrice.ts
      - apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPositions.ts
      - apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusTransactions.ts
      - apps/evm/src/clients/api/mutations/useOpenYieldPlusPosition/index.ts
      - apps/evm/src/constants/functionKey.ts
      - apps/evm/src/constants/routing.ts
      - apps/evm/src/App/Routes/index.tsx
      - apps/evm/src/containers/Layout/NavBar/useMenuItems/index.tsx
      - apps/evm/src/libs/translations/translations/en.json
      - apps/evm/src/pages/YieldPlus/index.tsx
      - apps/evm/src/pages/YieldPlus/components/TokenPairSelector/index.tsx
      - apps/evm/src/pages/YieldPlus/components/PairStatsBar/index.tsx
      - apps/evm/src/pages/YieldPlus/components/TradingViewChart/index.tsx
      - apps/evm/src/pages/YieldPlus/components/PositionsTable/index.tsx
      - apps/evm/src/pages/YieldPlus/components/TransactionsTable/index.tsx
  agent_b:
    role: Right Panel (Form + Banner)
    files:
      - apps/evm/src/pages/YieldPlus/components/PositionForm/index.tsx
      - apps/evm/src/pages/YieldPlus/components/CollateralForm/index.tsx
      - apps/evm/src/pages/YieldPlus/components/YieldPlusBanner/index.tsx
      - apps/evm/src/pages/YieldPlus/components/SlippageSettings/index.tsx
rationale: Agent A handles routing, API infrastructure, translations, and the left column (chart + tables). Agent B focuses on the right-column form panel which is self-contained with local state and reuses existing components (Slider, ProgressBar, HealthFactorPill, Select, TokenIcon). Both agents share scaffold types and FunctionKey constants but do not write to the same component files.
```

## Namespace
yield-plus

## Figma URLs
- Main page: https://www.figma.com/design/DTDw3AtDZQMthlqEDDfOZj/Yield-?node-id=688-23062&m=dev

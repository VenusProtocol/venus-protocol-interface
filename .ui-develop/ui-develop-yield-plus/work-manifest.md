# Work Manifest - Yield+

## Scaffold files (already written)
- `apps/evm/src/clients/api/queries/yieldPlus/types.ts`
- `apps/evm/src/constants/functionKey.ts` (updated)
- `apps/evm/src/constants/routing.ts` (updated)
- `apps/evm/src/libs/translations/translations/en.json` (updated)

## Agent A: Infrastructure + Left Column
- `apps/evm/src/clients/api/queries/yieldPlus/index.ts`
- `apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPairs.ts`
- `apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPairPrice.ts`
- `apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusPositions.ts`
- `apps/evm/src/clients/api/queries/yieldPlus/useGetYieldPlusTransactions.ts`
- `apps/evm/src/App/Routes/index.tsx` (modify)
- `apps/evm/src/containers/Layout/NavBar/useMenuItems/index.tsx` (modify)
- `apps/evm/src/hooks/useIsFeatureEnabled/index.tsx` (modify)
- `apps/evm/src/pages/YieldPlus/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/TokenPairSelector/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/PairStatsBar/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/TradingViewChart/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/PositionsTable/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/TransactionsTable/index.tsx`

## Agent B: Right Panel (Form + Banner)
- `apps/evm/src/pages/YieldPlus/components/PositionForm/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/CollateralForm/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/YieldPlusBanner/index.tsx`
- `apps/evm/src/pages/YieldPlus/components/SlippageSettings/index.tsx`

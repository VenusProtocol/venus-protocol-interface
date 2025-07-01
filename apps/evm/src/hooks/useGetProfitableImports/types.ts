import type { Asset, ImportableSupplyPosition } from 'types';

export interface ProfitableSupplyPosition {
  asset: Asset;
  userSupplyBalanceTokens: BigNumber;
  currentSupplyApyPercentage: number;
  supplyPosition: ImportableSupplyPosition;
}

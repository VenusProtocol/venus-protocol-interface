import type { Asset, Pool } from 'types';

export type ColumnKey =
  | 'asset'
  | 'supplyApy'
  | 'labeledSupplyApy'
  | 'borrowApy'
  | 'labeledBorrowApy'
  | 'pool'
  | 'collateral'
  | 'userSupplyBalance'
  | 'userBorrowBalance'
  | 'borrowBalance'
  | 'supplyBalance'
  | 'liquidity'
  | 'userPercentOfLimit'
  | 'userWalletBalance';

export interface PoolAsset extends Asset {
  pool: Pool;
}

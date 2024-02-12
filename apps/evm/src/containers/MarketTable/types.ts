import { Asset, Pool } from 'types';

export type ColumnKey =
  | 'asset'
  | 'supplyApyLtv'
  | 'labeledSupplyApyLtv'
  | 'borrowApy'
  | 'labeledBorrowApy'
  | 'pool'
  | 'collateral'
  | 'userSupplyBalance'
  | 'userBorrowBalance'
  | 'borrowBalance'
  | 'supplyBalance'
  | 'liquidity'
  | 'price'
  | 'userPercentOfLimit'
  | 'userWalletBalance';

export interface PoolAsset extends Asset {
  pool: Pool;
}

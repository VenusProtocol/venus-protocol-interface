import type { Address } from 'viem';

import type { Asset, EModeGroup } from 'types';

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
  poolName: string;
  poolComptrollerContractAddress: Address;
  poolUserEModeGroup?: EModeGroup;
}

import BigNumber from 'bignumber.js';
import { Asset } from 'types';

export type BorrowAsset = Pick<Asset, 'id' | 'name'> & {
  walletBalanceCoins: BigNumber;
  liquidityCents: Asset['liquidity'];
  borrowApyPercentage: number;
};

import BigNumber from 'bignumber.js';

export type BorrowAsset = {
  id: string;
  name: string;
  walletBalanceCoins: BigNumber;
  liquidityCents: BigNumber;
  borrowApyPercentage: number;
};

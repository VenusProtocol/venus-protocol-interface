import BigNumber from 'bignumber.js';

import { TokenSymbol } from 'types';

export type BorrowAsset = {
  id: string;
  symbol: TokenSymbol;
  name: string;
  walletBalanceCoins: BigNumber;
  liquidityCents: BigNumber;
  borrowApyPercentage: number;
};

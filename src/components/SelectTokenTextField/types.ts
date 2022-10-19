import BigNumber from 'bignumber.js';
import { TokenId } from 'types';

export interface TokenBalance {
  tokenId: TokenId;
  balanceWei: BigNumber;
}

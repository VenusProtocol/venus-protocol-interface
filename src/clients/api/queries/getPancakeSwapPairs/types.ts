import { Pair as PSPair, Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import { PSTokenCombination } from 'types';

import { type Provider } from 'clients/web3';

export interface GetPancakeSwapPairsInput {
  provider: Provider;
  tokenCombinations: PSTokenCombination[];
}

export interface PairAddress {
  tokenCombination: PSTokenCombination;
  address: string;
}

export interface TokenReserve {
  token: PSToken;
  reserveWei: BigNumber;
}

export type GetPancakeSwapPairsOutput = {
  pairs: PSPair[];
};

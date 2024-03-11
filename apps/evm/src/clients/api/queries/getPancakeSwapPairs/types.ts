import type { Pair as PSPair, Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import type BigNumber from 'bignumber.js';

import type { Provider } from 'libs/wallet';
import type { PSTokenCombination } from 'types';

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
  reserveMantissa: BigNumber;
}

export type GetPancakeSwapPairsOutput = {
  pairs: PSPair[];
};

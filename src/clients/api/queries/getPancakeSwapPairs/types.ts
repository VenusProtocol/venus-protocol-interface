import { Pair as PSPair, Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import { type Provider } from 'packages/wallet';
import { PSTokenCombination } from 'types';

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

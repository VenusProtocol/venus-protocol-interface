import { Pair as PSPair, Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import { Multicall as Multicall3 } from 'ethereum-multicall';
import { PSTokenCombination } from 'types';

export interface GetPancakeSwapPairsInput {
  multicall3: Multicall3;
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

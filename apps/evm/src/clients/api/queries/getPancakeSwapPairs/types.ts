import type { Pair as PSPair, Token as PSToken } from '@pancakeswap/sdk';
import type BigNumber from 'bignumber.js';
import type { PSTokenCombination } from 'types';
import type { PublicClient } from 'viem';
import type { Address } from 'viem';

export interface GetPancakeSwapPairsInput {
  publicClient: PublicClient;
  tokenCombinations: PSTokenCombination[];
}

export interface PairAddress {
  tokenCombination: PSTokenCombination;
  address: Address;
}

export interface TokenReserve {
  token: PSToken;
  reserveMantissa: BigNumber;
}

export type GetPancakeSwapPairsOutput = {
  pairs: PSPair[];
};

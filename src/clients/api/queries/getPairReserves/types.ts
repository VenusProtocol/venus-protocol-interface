import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';

export type TokenCombination = [PSToken, PSToken];

export interface GetPairReservesInput {
  multicall: Multicall;
  tokenCombinations: TokenCombination[];
}

export interface PairAddress {
  tokenCombination: TokenCombination;
  address: string;
}

export interface TokenReserve {
  token: PSToken;
  reserveWei: BigNumber;
}

export interface PairReserves {
  address: string;
  tokenReserves: [TokenReserve, TokenReserve];
}

export type GetPairReservesOutput = {
  pairReserves: PairReserves[];
};

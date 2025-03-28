import type BigNumber from 'bignumber.js';
import type { ChainId, Pool, Token } from 'types';
import type { Address, PublicClient } from 'viem';

export interface VTokenBalance {
  vTokenAddress: string;
  underlyingTokenBorrowBalanceMantissa: BigNumber;
  underlyingTokenSupplyBalanceMantissa: BigNumber;
}

export interface PrimeApy {
  borrowApy: BigNumber;
  supplyApy: BigNumber;
}
export interface GetPoolsInput {
  publicClient: PublicClient;
  poolLensContractAddress: Address;
  legacyPoolComptrollerContractAddress?: Address;
  venusLensContractAddress?: Address;
  vaiControllerContractAddress?: Address;
  primeContractAddress?: Address;
  chainId: ChainId;
  tokens: Token[];
  accountAddress?: Address;
}

export interface GetPoolsOutput {
  pools: Pool[];
}

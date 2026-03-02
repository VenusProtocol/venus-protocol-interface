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
  chainId: ChainId;
  tokens: Token[];
  isEModeFeatureEnabled: boolean;
  accountAddress?: Address;
  poolLensContractAddress?: Address;
  legacyPoolComptrollerContractAddress?: Address;
  venusLensContractAddress?: Address;
  vaiControllerContractAddress?: Address;
  primeContractAddress?: Address;
  resilientOracleContractAddress?: Address;
}

export interface GetPoolsOutput {
  pools: Pool[];
}

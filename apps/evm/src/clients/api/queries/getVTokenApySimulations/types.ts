import type { Asset } from 'types';
import type { Address, PublicClient } from 'viem';

export interface GetVTokenApySimulationsInput {
  publicClient: PublicClient;
  interestRateModelContractAddress: Address;
  isIsolatedPoolMarket: boolean;
  asset: Asset;
  blocksPerDay?: number;
}

export interface VTokenApySnapshot {
  utilizationRatePercentage: number;
  borrowApyPercentage: number;
  supplyApyPercentage: number;
}

export type GetVTokenApySimulationsOutput = {
  apySimulations: VTokenApySnapshot[];
  currentUtilizationRatePercentage: number;
};

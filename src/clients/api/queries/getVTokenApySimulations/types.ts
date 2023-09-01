import BigNumber from 'bignumber.js';
import { Multicall as Multicall3 } from 'ethereum-multicall';
import { Asset } from 'types';

export interface GetVTokenInterestRatesInput {
  multicall3: Multicall3;
  reserveFactorMantissa: BigNumber;
  interestRateModelContractAddress: string;
  isIsolatedPoolMarket: boolean;
  asset: Asset | undefined;
}

export interface VTokenApySnapshot {
  utilizationRate: number;
  borrowApyPercentage: number;
  supplyApyPercentage: number;
}

export type GetVTokenApySimulationsOutput = {
  apySimulations: VTokenApySnapshot[];
  currentUtilizationRate: number;
};

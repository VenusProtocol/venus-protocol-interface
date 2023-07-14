import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';
import { Asset } from 'types';

export interface GetVTokenInterestRatesInput {
  multicall: Multicall;
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

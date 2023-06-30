import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';

export interface GetVTokenInterestRatesInput {
  multicall: Multicall;
  reserveFactorMantissa: BigNumber;
  interestRateModelContractAddress: string;
  isIsolatedPoolMarket: boolean;
}

export interface VTokenApySnapshot {
  utilizationRate: number;
  borrowApyPercentage: number;
  supplyApyPercentage: number;
}

export type GetVTokenApySimulationsOutput = {
  apySimulations: VTokenApySnapshot[];
};

import { JumpRateModel, JumpRateModelV2 } from 'packages/contracts';
import { Asset } from 'types';

export interface GetVTokenInterestRatesInput {
  interestRateModelContract: JumpRateModel | JumpRateModelV2;
  isIsolatedPoolMarket: boolean;
  asset: Asset;
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

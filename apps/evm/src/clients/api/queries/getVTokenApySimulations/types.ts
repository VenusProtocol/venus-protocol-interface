import type { JumpRateModel, JumpRateModelV2 } from 'libs/contracts';
import type { Asset } from 'types';

export interface GetVTokenApySimulationsInput {
  interestRateModelContract: JumpRateModel | JumpRateModelV2;
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

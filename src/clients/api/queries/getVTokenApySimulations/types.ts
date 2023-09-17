import { ContractTypeByName } from 'packages/contracts';
import { Asset } from 'types';

export interface GetVTokenInterestRatesInput {
  interestRateModelContract:
    | ContractTypeByName<'jumpRateModel'>
    | ContractTypeByName<'jumpRateModelV2'>;
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

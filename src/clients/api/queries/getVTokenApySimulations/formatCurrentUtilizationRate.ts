import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface FormatCurrentUtilizationRateInput {
  utilizationRatePercentage: Awaited<
    ReturnType<
      (
        | ContractTypeByName<'jumpRateModel'>
        | ContractTypeByName<'jumpRateModelV2'>
      )['utilizationRate']
    >
  >;
}

const formatCurrentUtilizationRate = ({
  utilizationRatePercentage,
}: FormatCurrentUtilizationRateInput) =>
  new BigNumber(utilizationRatePercentage.toString())
    .dividedToIntegerBy(new BigNumber(10).pow(16))
    .toNumber();

export default formatCurrentUtilizationRate;

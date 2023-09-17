import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface FormatCurrentUtilizationRateInput {
  utilizationRate: Awaited<
    ReturnType<
      (
        | ContractTypeByName<'jumpRateModel'>
        | ContractTypeByName<'jumpRateModelV2'>
      )['utilizationRate']
    >
  >;
}

const formatCurrentUtilizationRate = ({ utilizationRate }: FormatCurrentUtilizationRateInput) =>
  new BigNumber(utilizationRate.toString())
    .dividedToIntegerBy(new BigNumber(10).pow(16))
    .toNumber();

export default formatCurrentUtilizationRate;

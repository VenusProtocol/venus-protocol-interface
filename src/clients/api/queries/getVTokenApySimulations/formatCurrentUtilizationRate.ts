import BigNumber from 'bignumber.js';
import { JumpRateModel, JumpRateModelV2 } from 'packages/contracts';

export interface FormatCurrentUtilizationRateInput {
  utilizationRatePercentage: Awaited<
    ReturnType<(JumpRateModel | JumpRateModelV2)['utilizationRate']>
  >;
}

const formatCurrentUtilizationRate = ({
  utilizationRatePercentage,
}: FormatCurrentUtilizationRateInput) =>
  new BigNumber(utilizationRatePercentage.toString())
    .dividedToIntegerBy(new BigNumber(10).pow(16))
    .toNumber();

export default formatCurrentUtilizationRate;

import BigNumber from 'bignumber.js';
import { JumpRateModel, JumpRateModelV2 } from 'libs/contracts';

export interface FormatCurrentUtilizationRateInput {
  utilizationRatePercentage: Awaited<
    ReturnType<(JumpRateModel | JumpRateModelV2)['utilizationRate']>
  >;
}

const DIVIDER = 10 ** 16;

const formatCurrentUtilizationRate = ({
  utilizationRatePercentage,
}: FormatCurrentUtilizationRateInput) =>
  new BigNumber(utilizationRatePercentage.toString()).dividedToIntegerBy(DIVIDER).toNumber();

export default formatCurrentUtilizationRate;

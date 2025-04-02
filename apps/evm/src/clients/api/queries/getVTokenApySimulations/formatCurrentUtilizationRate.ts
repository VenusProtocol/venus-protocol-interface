import BigNumber from 'bignumber.js';

export interface FormatCurrentUtilizationRateInput {
  utilizationRatePercentage: bigint;
}

const DIVIDER = 10 ** 16;

const formatCurrentUtilizationRate = ({
  utilizationRatePercentage,
}: FormatCurrentUtilizationRateInput) =>
  new BigNumber(utilizationRatePercentage.toString()).dividedToIntegerBy(DIVIDER).toNumber();

export default formatCurrentUtilizationRate;

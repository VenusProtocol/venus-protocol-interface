import BigNumber from 'bignumber.js';
import { FULL_REPAYMENT_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';

export const buffer = ({
  amountMantissa,
  bufferPercentage = FULL_REPAYMENT_BUFFER_PERCENTAGE,
}: { amountMantissa: bigint; bufferPercentage?: number }) =>
  BigInt(
    new BigNumber(amountMantissa)
      .multipliedBy(1 + bufferPercentage / 100)
      .toFixed(0, BigNumber.ROUND_UP),
  );

import BigNumber from 'bignumber.js';

export const buffer = ({
  amountMantissa,
  bufferPercentage = 0.1,
}: { amountMantissa: bigint; bufferPercentage?: number }) =>
  BigInt(
    new BigNumber(amountMantissa)
      .multipliedBy(1 + bufferPercentage / 100)
      .toFixed(0, BigNumber.ROUND_UP),
  );

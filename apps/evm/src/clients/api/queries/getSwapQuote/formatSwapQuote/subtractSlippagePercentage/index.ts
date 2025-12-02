import BigNumber from 'bignumber.js';

export const subtractSlippagePercentage = ({
  amount,
  slippagePercentage,
}: { amount: bigint; slippagePercentage: number }) =>
  BigInt(new BigNumber((Number(amount) * (100 - slippagePercentage)) / 100).toFixed(0));

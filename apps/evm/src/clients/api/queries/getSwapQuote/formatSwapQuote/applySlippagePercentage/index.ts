import BigNumber from 'bignumber.js';

export const applySlippagePercentage = ({
  amount,
  slippagePercentage,
}: { amount: bigint; slippagePercentage: number }) => {
  const adjustedAmount = new BigNumber(amount.toString())
    .multipliedBy(new BigNumber(100).plus(slippagePercentage.toString()))
    .div(100);

  return BigInt(adjustedAmount.toFixed(0));
};

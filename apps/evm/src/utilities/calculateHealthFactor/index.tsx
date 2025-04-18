import BigNumber from 'bignumber.js';

export const calculateHealthFactor = ({
  liquidationThresholdCents,
  borrowBalanceCents,
}: {
  liquidationThresholdCents: number;
  borrowBalanceCents: number;
}) => {
  if (borrowBalanceCents === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Number(new BigNumber(liquidationThresholdCents).div(borrowBalanceCents).toFixed(2));
};

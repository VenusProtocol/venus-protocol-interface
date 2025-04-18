import BigNumber from 'bignumber.js';

export const calculateHealthFactor = ({
  borrowLimitCents,
  borrowBalanceCents,
}: {
  borrowLimitCents: number;
  borrowBalanceCents: number;
}) => {
  if (borrowBalanceCents === 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Number(new BigNumber(borrowLimitCents).div(borrowBalanceCents).toFixed(2));
};

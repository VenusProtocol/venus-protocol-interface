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

  return borrowLimitCents / borrowBalanceCents;
};

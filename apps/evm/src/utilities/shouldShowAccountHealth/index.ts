import type { Pool } from 'types';

export const shouldShowAccountHealth = ({
  pool,
  simulatedPool,
}: {
  pool: Pool;
  simulatedPool?: Pool;
}) =>
  !!pool.userBorrowBalanceCents?.isGreaterThan(0) ||
  !!simulatedPool?.userBorrowBalanceCents?.isGreaterThan(0);

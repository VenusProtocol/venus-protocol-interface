import type { To } from 'react-router';
import type { Token } from 'types';

export interface BlockingBorrowPosition {
  token: Token;
  userBorrowBalanceTokens: BigNumber;
  userBorrowBalanceCents: number;
  to: To;
}

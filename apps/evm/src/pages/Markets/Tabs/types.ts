import type { To } from 'react-router';
import type { EModeGroup, Token } from 'types';

export interface BlockingBorrowPosition {
  token: Token;
  userBorrowBalanceTokens: BigNumber;
  userBorrowBalanceCents: number;
  to: To;
}

export interface ExtendedEModeGroup extends EModeGroup {
  userBlockingBorrowPositions: BlockingBorrowPosition[];
  userHasEnoughCollateral: boolean;
  hypotheticalUserHealthFactor: number;
}

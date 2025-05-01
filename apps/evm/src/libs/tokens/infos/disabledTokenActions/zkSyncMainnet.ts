import type { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  // zkETH
  {
    address: '0xCEb7Da150d16aCE58F090754feF2775C23C8b631',
    disabledActions: ['supply', 'borrow', 'withdraw', 'repay'],
  },
];

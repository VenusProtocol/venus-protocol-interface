import type { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  // BNB
  {
    address: '0x0000000000000000000000000000000000000000',
    disabledActions: ['swapAndSupply'],
  },
];

import type { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  {
    address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    disabledActions: ['boost', 'repayWithCollateral', 'swapAndSupply', 'swapAndRepay'],
  },
];

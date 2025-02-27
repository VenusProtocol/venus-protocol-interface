import type { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  // vwUSDM - Core pool
  {
    address: '0x183dE3C349fCf546aAe925E1c7F364EA6FB4033c',
    disabledActions: ['supply', 'borrow'],
  },
];

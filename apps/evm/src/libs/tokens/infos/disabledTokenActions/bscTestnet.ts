import { NATIVE_TOKEN_ADDRESS } from '@venusprotocol/chains';

import type { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  // BNB
  {
    address: NATIVE_TOKEN_ADDRESS,
    disabledActions: ['swapAndSupply', 'boost', 'repayWithCollateral'],
  },
];

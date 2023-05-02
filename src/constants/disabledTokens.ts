import { Token } from 'types';

import { MAINNET_TOKENS } from 'constants/tokens';

export type Action = 'borrow' | 'repay' | 'supply' | 'withdraw';

interface DisabledToken {
  token: Token;
  disabledActions: Action[];
}

export const DISABLED_TOKENS: DisabledToken[] = [
  {
    token: MAINNET_TOKENS.ust,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: MAINNET_TOKENS.sxp,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: MAINNET_TOKENS.trxold,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: MAINNET_TOKENS.beth,
    disabledActions: ['borrow'],
  },
];

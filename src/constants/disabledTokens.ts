import config from 'config';
import { Token, TokenAction } from 'types';

import { MAINNET_TOKENS, TESTNET_TOKENS } from 'constants/tokens';

interface DisabledToken {
  token: Token;
  disabledActions: TokenAction[];
}

export const DISABLED_TOKENS_TESTNET: DisabledToken[] = [
  {
    token: TESTNET_TOKENS.busd,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: TESTNET_TOKENS.ust,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: TESTNET_TOKENS.luna,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: TESTNET_TOKENS.sxp,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: TESTNET_TOKENS.trxold,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: TESTNET_TOKENS.tusdold,
    disabledActions: ['borrow', 'supply'],
  },
];

export const DISABLED_TOKENS_MAINNET: DisabledToken[] = [
  {
    token: MAINNET_TOKENS.busd,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: MAINNET_TOKENS.ust,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: MAINNET_TOKENS.luna,
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
    token: MAINNET_TOKENS.tusdold,
    disabledActions: ['borrow', 'supply'],
  },
  {
    token: MAINNET_TOKENS.beth,
    disabledActions: ['borrow'],
  },
];

export const DISABLED_TOKENS = config.isOnTestnet
  ? DISABLED_TOKENS_TESTNET
  : DISABLED_TOKENS_MAINNET;

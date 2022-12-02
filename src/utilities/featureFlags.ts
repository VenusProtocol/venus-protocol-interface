import { Token } from 'types';

import { TOKENS } from 'constants/tokens';

export const DISABLED_TOKENS = [TOKENS.ust, TOKENS.luna];

export const isTokenEnabled = (token: Token) =>
  !DISABLED_TOKENS.some(disabledToken => disabledToken.address === token.address);

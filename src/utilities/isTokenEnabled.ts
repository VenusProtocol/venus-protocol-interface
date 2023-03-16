import { Token } from 'types';

import { DISABLED_TOKENS } from 'constants/disabledTokens';

import areTokensEqual from './areTokensEqual';

export const isTokenEnabled = (token: Token) =>
  !DISABLED_TOKENS.some(disabledToken => areTokensEqual(disabledToken, token));

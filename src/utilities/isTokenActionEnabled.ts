import { Token, TokenAction } from 'types';

import { DISABLED_TOKENS } from 'constants/disabledTokens';

import areTokensEqual from './areTokensEqual';

export const isTokenActionEnabled = ({ token, action }: { token: Token; action: TokenAction }) => {
  const disabledToken = DISABLED_TOKENS.find(item => areTokensEqual(item.token, token));
  return !disabledToken || !disabledToken.disabledActions.includes(action);
};

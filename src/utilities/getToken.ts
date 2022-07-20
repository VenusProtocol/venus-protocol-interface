import { Token, TokenId } from 'types';

import { TOKENS } from 'constants/tokens';

export const getToken = (id: TokenId) => TOKENS[id] as Token;

export default getToken;

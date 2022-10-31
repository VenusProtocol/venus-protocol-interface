import { Token, TokenId } from 'types';

import tokenList from 'pages/Swap/tokenList';

// TODO: fix (TokenId type is incorrect, tokenList should be imported from a global list) - (see https://jira.toolsfdg.net/browse/VEN-712)
export const getToken = (id: TokenId) => tokenList[id] as Token;

export default getToken;

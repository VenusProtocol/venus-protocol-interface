import { TokenId, IToken } from 'types';
import { TOKENS } from 'constants/tokens';

export const getToken = (id: TokenId) => TOKENS[id] as IToken;

export default getToken;

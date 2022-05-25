import { TokenId, IToken } from 'types';
import { TOKENS } from 'constants/tokens';

const getToken = (id: TokenId) => TOKENS[id] as IToken;

export default getToken;

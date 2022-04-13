import { TokenSymbol, IToken } from 'types';
import { TOKENS } from 'constants/tokens';

// @TODO: refactor to take chain ID in consideration (currently handled in
// constant file directly)
const getToken = (key: TokenSymbol): IToken => TOKENS[key as keyof typeof TOKENS] as IToken;

export default getToken;

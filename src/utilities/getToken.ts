import { TokenSymbol, IToken } from 'types';
import { TOKENS } from 'constants/tokens';

const getToken = (key: TokenSymbol): IToken => TOKENS[key as keyof typeof TOKENS] as IToken;

export default getToken;

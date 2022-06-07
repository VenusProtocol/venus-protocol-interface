import { IToken } from 'types';
import { TOKENS } from 'constants/tokens';

const getTokenByAddress = (address: string) => {
  let token: IToken | undefined;

  Object.keys(TOKENS)
    .filter(key => Object.prototype.hasOwnProperty.call(TOKENS, key))
    .forEach(tokenId => {
      const currentToken = TOKENS[tokenId as keyof typeof TOKENS];
      if (currentToken?.address === address) {
        token = currentToken as IToken;
      }
    });

  return token;
};

export default getTokenByAddress;

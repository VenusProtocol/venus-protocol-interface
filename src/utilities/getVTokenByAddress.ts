import { Token } from 'types';

import { VBEP_TOKENS } from 'constants/tokens';

const getVTokenByAddress = (address: string) => {
  let token: Token | undefined;

  Object.keys(VBEP_TOKENS)
    .filter(key => Object.prototype.hasOwnProperty.call(VBEP_TOKENS, key))
    .forEach(tokenId => {
      const currentToken = VBEP_TOKENS[tokenId as keyof typeof VBEP_TOKENS];
      if (currentToken?.address.toLowerCase() === address.toLowerCase()) {
        token = currentToken as Token;
      }
    });

  return token;
};

export default getVTokenByAddress;

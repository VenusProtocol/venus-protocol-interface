import { IToken, TokenId } from 'types';
import { TOKENS } from 'constants/tokens';

const getTokenByAddress = (address: string) => {
  const tokenId = Object.keys(TOKENS).find(
    key => TOKENS[key as keyof typeof TOKENS]?.address === address,
  );

  return tokenId && Object.prototype.hasOwnProperty.call(TOKENS, tokenId)
    ? (TOKENS[tokenId as TokenId] as IToken)
    : undefined;
};

export default getTokenByAddress;

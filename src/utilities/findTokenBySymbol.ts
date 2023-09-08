import { Token, VToken } from 'types';

function findTokenBySymbol<TToken extends Token | VToken>({
  symbol,
  tokens,
}: {
  symbol: string;
  tokens: TToken[];
}) {
  return tokens.find(token => token.symbol === symbol);
}

export default findTokenBySymbol;

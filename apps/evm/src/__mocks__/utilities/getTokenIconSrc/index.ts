import { tokens } from '@venusprotocol/chains';

export const getTokenIconSrc = ({ symbol }: { symbol: string }) =>
  Object.values(tokens)
    .flat()
    .find(candidateToken => candidateToken.symbol.toLowerCase() === symbol.toLowerCase())
    ?.iconSrc || '';

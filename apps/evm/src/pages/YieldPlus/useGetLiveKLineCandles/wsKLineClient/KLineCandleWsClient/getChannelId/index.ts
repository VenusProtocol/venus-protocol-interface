import type { Token } from 'types';

export const getChannelId = ({
  baseToken,
  quoteToken,
}: {
  baseToken: Token;
  quoteToken: Token;
}) => `${baseToken.symbol}/${quoteToken.symbol}`;

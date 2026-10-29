import { WIDE_BACKGROUND_ASSET_SYMBOLS } from '../../constants';

export const getPlanetRank = (symbol: string) => {
  const rank = WIDE_BACKGROUND_ASSET_SYMBOLS.indexOf(symbol);

  return rank === -1 ? WIDE_BACKGROUND_ASSET_SYMBOLS.length : rank;
};

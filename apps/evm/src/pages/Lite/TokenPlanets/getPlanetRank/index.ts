import { PLANET_SYMBOL_ORDER } from '../palettes';

export const getPlanetRank = (symbol: string) => {
  const index = PLANET_SYMBOL_ORDER.indexOf(symbol);
  return index === -1 ? PLANET_SYMBOL_ORDER.length : index;
};

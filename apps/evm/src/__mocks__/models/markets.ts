import { formatToMarket } from 'utilities';
import apiMarketsResponse from '../api/markets.json';

import type { Market } from 'types';

export const markets: Market[] = apiMarketsResponse.result.map(apiMarket =>
  formatToMarket({ apiMarket }),
);

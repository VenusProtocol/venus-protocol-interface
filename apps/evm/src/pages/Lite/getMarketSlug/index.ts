import type { LiteBorrowMarket, LiteEarnMarket } from '../types';

export const getMarketSlug = (market: LiteEarnMarket | LiteBorrowMarket) =>
  market.source.type === 'spoke'
    ? market.source.pool.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    : market.source.type;

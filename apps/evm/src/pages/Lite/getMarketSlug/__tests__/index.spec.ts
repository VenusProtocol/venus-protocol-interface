import { getMarketSlug } from '..';
import type { LiteBorrowMarket, LiteEarnMarket } from '../../types';

const buildMarket = (source: object) =>
  ({ source }) as unknown as LiteEarnMarket | LiteBorrowMarket;

describe('getMarketSlug', () => {
  it('uses the source type for core, hub and vault markets', () => {
    expect(getMarketSlug(buildMarket({ type: 'core' }))).toBe('core');
    expect(getMarketSlug(buildMarket({ type: 'hub' }))).toBe('hub');
    expect(getMarketSlug(buildMarket({ type: 'vault' }))).toBe('vault');
  });

  it('slugifies the pool name for spoke markets', () => {
    expect(getMarketSlug(buildMarket({ type: 'spoke', pool: { name: 'bStock index' } }))).toBe(
      'bstock-index',
    );
    expect(
      getMarketSlug(buildMarket({ type: 'spoke', pool: { name: '  QA multi-pool spoke!' } })),
    ).toBe('qa-multi-pool-spoke');
  });
});

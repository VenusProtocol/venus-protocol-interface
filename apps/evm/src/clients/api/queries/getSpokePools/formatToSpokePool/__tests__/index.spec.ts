import spokePoolsResponse from '__mocks__/api/spokePools.json';
import { ChainId } from 'types';

import { formatToSpokePool } from '..';
import type { ApiSpokeMarket, ApiSpokePool } from '../../types';

const [basePool] = (spokePoolsResponse as { result: ApiSpokePool[] }).result;

const buildMarket = (overrides: Partial<ApiSpokeMarket>): ApiSpokeMarket => ({
  ...basePool.markets[0],
  isListed: true,
  side: 'collateral',
  supplyAllowlistEnabled: false,
  ...overrides,
});

const format = (apiPool: ApiSpokePool) =>
  formatToSpokePool({
    apiPool,
    chainId: ChainId.BSC_TESTNET,
    tokens: [],
    isUserConnected: false,
    isUserDataUnavailable: false,
    userPositions: [],
    userTokenBalances: [],
    apiTokens: [],
    supplyAllowlistStatus: {},
  });

describe('formatToSpokePool whitelist and info tags', () => {
  it('sets hasWhitelist only when every collateral market has its allowlist on', () => {
    const allCollateralAllowlisted = format({
      ...basePool,
      markets: [
        buildMarket({ supplyAllowlistEnabled: true }),
        buildMarket({ supplyAllowlistEnabled: true }),
      ],
    });
    expect(allCollateralAllowlisted.hasWhitelist).toBe(true);

    const someCollateralAllowlisted = format({
      ...basePool,
      markets: [
        buildMarket({ supplyAllowlistEnabled: true }),
        buildMarket({ supplyAllowlistEnabled: false }),
      ],
    });
    expect(someCollateralAllowlisted.hasWhitelist).toBe(false);
  });

  it('ignores liquidity-side allowlists', () => {
    const pool = format({
      ...basePool,
      markets: [
        buildMarket({ supplyAllowlistEnabled: true }),
        buildMarket({ side: 'liquidity', supplyAllowlistEnabled: true }),
      ],
    });

    expect(pool.hasWhitelist).toBe(true);
  });

  it('does not set hasWhitelist when the pool has no collateral market', () => {
    const pool = format({
      ...basePool,
      markets: [buildMarket({ side: 'liquidity', supplyAllowlistEnabled: true })],
    });

    expect(pool.hasWhitelist).toBe(false);
  });

  it('returns info tags sorted by order with non-info and invalid links dropped', () => {
    const pool = format({
      ...basePool,
      markets: [],
      tags: [
        {
          type: 'info',
          content: { en: 'Second' },
          url: 'https://docs.example.com',
          urlLabel: { en: 'Read more' },
          order: 2,
        },
        { type: 'whitelist', content: { en: 'Ignored' }, order: 0 },
        { type: 'info', content: { en: 'First' }, url: 'http://insecure.example.com', order: 1 },
      ],
    });

    expect(pool.infoTags).toEqual([
      { title: undefined, content: { en: 'First' }, url: undefined, urlLabel: undefined },
      {
        title: undefined,
        content: { en: 'Second' },
        url: 'https://docs.example.com',
        urlLabel: { en: 'Read more' },
      },
    ]);
  });

  it('returns no info tags when the pool has none', () => {
    expect(format({ ...basePool, markets: [], tags: undefined }).infoTags).toEqual([]);
  });
});

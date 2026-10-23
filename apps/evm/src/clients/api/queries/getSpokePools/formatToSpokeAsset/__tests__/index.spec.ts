import spokePoolsResponse from '__mocks__/api/spokePools.json';
import { usdc } from '__mocks__/models/tokens';
import type { GetSpokePoolsResponse } from 'clients/api/queries/getSpokePools/types';
import { ChainId, type Token } from 'types';

import { formatToSpokeAsset } from '..';

const { result: apiPools = [] } = spokePoolsResponse as GetSpokePoolsResponse;
const apiMarket = apiPools[0].markets[0];

const tslab: Token = {
  ...usdc,
  address: '0x0000000000000000000000000000000000007514',
  decimals: 18,
  symbol: 'TSLAB',
};

const format = (overrides: Partial<typeof apiMarket>, token: Token) =>
  formatToSpokeAsset({
    apiMarket: { ...apiMarket, underlyingAddress: token.address, ...overrides },
    chainId: ChainId.BSC_TESTNET,
    tokens: [token],
    isUserConnected: false,
    userTokenBalances: [],
  });

describe('formatToSpokeAsset', () => {
  it('computes the total supply exactly as the comptroller supply cap check does', () => {
    // Testnet vTSLAB_HubSpoke, where MAX overshot the cap
    const asset = format(
      {
        totalSupplyMantissa: '301598374995',
        exchangeRateMantissa: '10000000000076097982899876333',
        supplyCapsMantissa: '10000000000000000000000',
      },
      tslab,
    );

    expect(asset?.supplyBalanceTokens.toFixed()).toBe('3015.983749972951027982');
    expect(asset?.supplyCapTokens.minus(asset.supplyBalanceTokens).toFixed()).toBe(
      '6984.016250027048972018',
    );
  });

  it('never carries more decimals than the underlying token supports', () => {
    const asset = format(
      {
        totalSupplyMantissa: '1698597054466',
        exchangeRateMantissa: '10000000000004000000',
      },
      usdc,
    );

    expect(asset?.supplyBalanceTokens.decimalPlaces()).toBeLessThanOrEqual(usdc.decimals);
  });
});

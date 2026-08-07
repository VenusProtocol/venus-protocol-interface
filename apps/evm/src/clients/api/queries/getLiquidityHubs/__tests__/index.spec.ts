import type { Mock } from 'vitest';

import liquidityHubsResponse from '__mocks__/api/liquidityHubs.json';
import { usdc, xvs } from '__mocks__/models/tokens';
import { ChainId } from 'types';
import { restService } from 'utilities';
import { getLiquidityHubs } from '..';

vi.mock('utilities/restService');

const fakeHubAddress = liquidityHubsResponse.result[0].hubAddress;

describe('getLiquidityHubs', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({
      data: liquidityHubsResponse,
    }));
  });

  it('returns formatted liquidity hubs and filters unsupported exposure and reward tokens', async () => {
    const response = await getLiquidityHubs({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, xvs],
    });

    const [liquidityHub] = response.liquidityHubs;

    expect(liquidityHub.vhToken.address).toBe(fakeHubAddress);
    expect(liquidityHub.tokenPriceCents.toFixed()).toBe('250');
    expect(liquidityHub.supplyBalanceTokens.toFixed()).toBe('1000');
    expect(liquidityHub.supplyApyPercentage.toFixed()).toBe('5');
    expect(liquidityHub.performanceFeePercentage.toFixed()).toBe('10');
    expect(liquidityHub.pricePerShare.toFixed()).toBe('1.02');
    expect(liquidityHub.supplyTokenDistributions).toHaveLength(1);
    expect(liquidityHub.yieldGroups[0].sources[0].collateralTokens).toEqual([xvs]);
  });

  it('calls the API-backed liquidity hubs endpoint', async () => {
    await getLiquidityHubs({
      chainId: ChainId.BSC_TESTNET,
      tokens: [usdc, xvs],
    });

    expect(restService).toHaveBeenCalledWith({
      endpoint: '/liquidity-hub/hubs',
      method: 'GET',
      params: {
        chainId: ChainId.BSC_TESTNET,
        accountAddress: undefined,
      },
    });
  });
});

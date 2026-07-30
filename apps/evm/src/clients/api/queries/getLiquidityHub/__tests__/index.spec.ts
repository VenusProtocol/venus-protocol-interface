import type { Mock } from 'vitest';

import { ChainId } from '@venusprotocol/chains';
import { usdc } from '__mocks__/models/tokens';
import { restService } from 'utilities';

import { getLiquidityHub } from '..';

vi.mock('utilities/restService');

const fakeHubAddress = '0x2000000000000000000000000000000000000001';

const apiLiquidityHub = {
  hubAddress: fakeHubAddress,
  underlyingTokenAddress: usdc.address,
  name: 'Venus USDC Liquidity Hub',
  symbol: 'vhUSDC',
  hubTokenDecimals: 6,
  underlyingTokenDecimals: 6,
  tokenPriceOracleAddress: '0x4000000000000000000000000000000000000001',
  tokenPriceUsdMantissa: '1000000000000000000',
  totalUnderlyingMantissa: '1000000000',
  totalUnderlyingUsdMantissa: '1000000000000000000000',
  hubTokenSupplyMantissa: '980392157',
  exchangeRateMantissa: '1020000000000000000',
  pricePerShare: '1.02',
  blendedApyRatio: '0.05',
  rewardsDistributors: [],
  supplyCapacityMantissa: '2000000000',
  supplyCapacityUsdMantissa: '2000000000000000000000',
  liquidityMantissa: '500000000',
  liquidityUsdMantissa: '500000000000000000000',
  suppliersCount: 2,
  maxWithdrawalSizeMantissa: '500000000',
  managementFeeRatio: '0',
  performanceFeeRatio: '0.1',
  redeemFeeRatio: '0.01',
  isPaused: false,
  yieldGroups: [],
};

describe('getLiquidityHub', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({
      data: { chainId: ChainId.BSC_MAINNET, hub: apiLiquidityHub },
    }));
  });

  it('fetches and formats a singular liquidity hub', async () => {
    const response = await getLiquidityHub({
      chainId: ChainId.BSC_MAINNET,
      tokens: [usdc],
      vhTokenAddress: fakeHubAddress,
    });

    expect(response.liquidityHub?.vhToken.address).toBe(fakeHubAddress);
    expect(response.liquidityHub?.supplyBalanceTokens.toFixed()).toBe('1000');
  });

  it('calls the singular liquidity hub endpoint', async () => {
    await getLiquidityHub({
      chainId: ChainId.BSC_MAINNET,
      tokens: [usdc],
      vhTokenAddress: fakeHubAddress,
    });

    expect(restService).toHaveBeenCalledWith({
      endpoint: `/liquidity-hub/hubs/${fakeHubAddress}`,
      method: 'GET',
      params: {
        chainId: ChainId.BSC_MAINNET,
        accountAddress: undefined,
      },
    });
  });
});

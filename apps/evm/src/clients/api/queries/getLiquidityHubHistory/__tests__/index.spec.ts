import type { Mock } from 'vitest';

import { ChainId } from '@venusprotocol/chains';
import { restService } from 'utilities';

import { getLiquidityHubHistory } from '..';

vi.mock('utilities/restService');

const fakeVhTokenAddress = '0x2000000000000000000000000000000000000001';

const apiSnapshot = {
  blockNumber: '1',
  blockTimestamp: '1652593258',
  supplyApy: '7.4',
  totalSupplyCents: '10903750',
  exchangeRateMantissa: '1060000000000000000',
  pricePerShare: '1.06',
};

describe('getLiquidityHubHistory', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({
      data: { chainId: ChainId.BSC_MAINNET, range: '1m', result: [apiSnapshot] },
    }));
  });

  it('formats liquidity hub history on success', async () => {
    const response = await getLiquidityHubHistory({
      chainId: ChainId.BSC_MAINNET,
      vhTokenAddress: fakeVhTokenAddress,
      period: '1m',
    });

    expect(response).toEqual({
      liquidityHubSnapshots: [
        {
          blockNumber: 1,
          blockTimestamp: 1652593258 * 1000,
          supplyApyPercentage: Number('7.4'),
          totalSupplyCents: Number('10903750'),
          pricePerShare: Number('1.06'),
        },
      ],
    });
  });

  it('passes the selected liquidity hub period through unchanged as the range', async () => {
    await getLiquidityHubHistory({
      chainId: ChainId.BSC_MAINNET,
      vhTokenAddress: fakeVhTokenAddress,
      period: '3m',
    });

    expect(restService).toHaveBeenCalledWith({
      endpoint: `/liquidity-hub/hubs/${fakeVhTokenAddress}/history`,
      method: 'GET',
      params: {
        chainId: ChainId.BSC_MAINNET,
        range: '3m',
      },
    });
  });
});

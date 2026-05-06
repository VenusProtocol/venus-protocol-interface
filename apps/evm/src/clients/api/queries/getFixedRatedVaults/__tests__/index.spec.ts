import { ChainId } from 'types';
import { restService } from 'utilities';
import type { Mock } from 'vitest';

import { getFixedRatedVaults } from '..';
import type { GetFixedRatedVaultsResponse } from '../types';

vi.mock('utilities/restService');

const fakeInput = {
  chainId: ChainId.BSC_MAINNET,
};

const fakeFixedRatedVaultsResponse: GetFixedRatedVaultsResponse = {
  result: [
    {
      id: '56-pendle-0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e',
      chainId: '56',
      protocol: 'pendle',
      vaultAddress: '0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e',
      underlyingAssetAddress: '0xe052823b4aefc6e230FAf46231A57d0905E30AE0',
      fixedApyDecimal: '0.0339809766',
      maturityDate: '2026-06-25T00:00:00.000Z',
      protocolData: {
        startDate: '2025-10-09T09:04:39.000Z',
        ptDiscount: 0.00923603148159602,
        ptTokenSymbol: 'PT-clisBNB-25JUN2026',
        underlyingApy: 0.04487067325658617,
        liquidityCents: '742673002',
        ptTokenAddress: '0xe052823b4aefc6e230faf46231a57d0905e30ae0',
        accountingAsset: {
          name: 'BNB',
          symbol: 'BNB',
          address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          decimals: 18,
          priceUsd: 660.36349666,
        },
        ptTokenPriceUsd: 653.4852516038151,
        underlyingAsset: {
          name: 'slisBNB',
          symbol: 'slisBNB',
          address: '0xb0b84d294e0c75a6abe60171b70edeb2efd14a1b',
          decimals: 18,
          priceUsd: 682.6875571967538,
        },
        pendleMarketAddress: '0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5',
      },
      createdAt: '2026-03-13T02:16:23.000Z',
      updatedAt: '2026-03-15T15:38:02.000Z',
      underlyingToken: [
        {
          address: '0xe052823b4aefc6e230FAf46231A57d0905E30AE0',
          chainId: '56',
          name: null,
          symbol: null,
          decimals: 18,
          maturityDate: '2026-06-25T00:00:00.000Z',
          createdAt: '2026-01-21T20:14:15.000Z',
          updatedAt: '2026-01-21T20:14:15.000Z',
        },
      ],
    },
  ],
};

describe('getFixedRatedVaults', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({
      data: fakeFixedRatedVaultsResponse,
    }));
  });

  it('returns fixed rate vaults on success', async () => {
    const response = await getFixedRatedVaults(fakeInput);

    expect(response).toEqual(fakeFixedRatedVaultsResponse.result);
  });

  it('calls restService with correct params', async () => {
    await getFixedRatedVaults(fakeInput);

    expect(restService).toHaveBeenCalledTimes(1);
    expect(restService).toHaveBeenCalledWith({
      endpoint: '/fixed-rate-vaults',
      method: 'GET',
      params: {
        chainId: ChainId.BSC_MAINNET,
        includeExpired: true,
      },
    });
  });

  it('throws when the API returns an error payload', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: { error: 'Some error' },
    }));

    await expect(getFixedRatedVaults(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws when the API returns no payload', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: undefined,
    }));

    await expect(getFixedRatedVaults(fakeInput)).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('returns empty array when the payload result is undefined', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: {},
    }));

    const response = await getFixedRatedVaults(fakeInput);

    expect(response).toEqual([]);
  });
});

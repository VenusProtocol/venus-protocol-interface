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
    {
      id: '97-institutional-vault-0x1A06619e4B7Bfa526dD1d0da86939D4f93317a2b',
      chainId: '97',
      protocol: 'institutional-vault',
      vaultAddress: '0x1A06619e4B7Bfa526dD1d0da86939D4f93317a2b',
      underlyingAssetAddress: '0x312e39c7641cE64BEccDe53613f07952258fa810',
      fixedApyDecimal: '0.0500000000',
      maturityDate: '2026-04-23T07:38:22.000Z',
      protocolData: {
        lockDurationSeconds: 2592000,
        openDurationSeconds: 1800,
        collateralAssetAddress: '0xCC3933141a64E26C9317b19CE4BbB4ec2c333bc6',
        latePenaltyRateMantissa: '1150000000000000000',
        settlementWindowSeconds: 259200,
        institutionOperatorAddress: '0x45bE7346a092BeD374C8fb308ddDe89BEC03031E',
      },
      createdAt: '2026-03-24T02:50:43.000Z',
      updatedAt: '2026-03-30T13:39:47.000Z',
      underlyingToken: [],
      loanVaultDetail: {
        id: '97-0x1A06619e4B7Bfa526dD1d0da86939D4f93317a2b',
        chainId: '97',
        fixedRateVaultId: '97-institutional-vault-0x1A06619e4B7Bfa526dD1d0da86939D4f93317a2b',
        vaultState: 2,
        collateralAssetAddress: '0xCC3933141a64E26C9317b19CE4BbB4ec2c333bc6',
        supplyAssetAddress: '0x312e39c7641cE64BEccDe53613f07952258fa810',
        institutionAddress: '0x45bE7346a092BeD374C8fb308ddDe89BEC03031E',
        minBorrowCapMantissa: '100000000000',
        maxBorrowCapMantissa: '1000000000000',
        totalRaisedMantissa: '760000000000',
        openEndTime: '2026-03-24T07:38:22.000Z',
        lockEndTime: '2026-04-23T07:38:22.000Z',
        settlementDeadline: '2026-04-26T07:38:22.000Z',
        reserveFactorMantissa: '100000000000000000',
        totalOwedMantissa: '0',
        outstandingDebtMantissa: '0',
        liquidationThresholdMantissa: '850000000000000000',
        liquidationIncentiveMantissa: '1100000000000000000',
        latePenaltyRateMantissa: '1150000000000000000',
        collateralValueCents: '140000000',
        debtValueCents: '0',
        liquidityMantissa: '1190000000000000000000000',
        shortfallMantissa: '0',
        createdAt: '2026-03-24T02:50:43.000Z',
        updatedAt: '2026-03-30T13:39:47.000Z',
      },
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

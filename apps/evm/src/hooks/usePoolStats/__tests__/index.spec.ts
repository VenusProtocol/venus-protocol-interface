import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { altAddress } from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import tokens, { vai, xvs } from '__mocks__/models/tokens';
import {
  useGetTokenBalances,
  useGetVTokenBalances,
  useGetVenusVaiVaultDailyRate,
} from 'clients/api';
import type {
  GetTokenBalancesInput,
  GetTokenBalancesOutput,
} from 'clients/api/queries/getTokenBalances';
import type {
  GetVTokenBalancesInput,
  GetVTokenBalancesOutput,
} from 'clients/api/queries/getVTokenBalances';
import { useGetVTreasuryContractAddress } from 'hooks/useGetVTreasuryContractAddress';
import { type UseGetTokenInput, useGetToken, useGetTokens } from 'libs/tokens';
import { renderHook } from 'testUtils/render';
import type { Asset, Token, VToken } from 'types';

import { usePoolStats } from '..';

vi.mock('hooks/useGetVTreasuryContractAddress');

const dailyRateMantissa = new BigNumber('1000000000000000000');

describe('usePoolStats', () => {
  beforeEach(() => {
    (useGetVTreasuryContractAddress as Mock).mockReturnValue(altAddress);
    (useGetTokens as Mock).mockReturnValue(tokens);
    (useGetToken as Mock).mockImplementation(({ symbol }: UseGetTokenInput) => {
      if (symbol === 'XVS') {
        return xvs;
      }

      if (symbol === 'VAI') {
        return vai;
      }

      return undefined;
    });

    (useGetTokenBalances as Mock).mockImplementation(
      ({ tokens: currentTokens }: GetTokenBalancesInput): { data: GetTokenBalancesOutput } => ({
        data: {
          tokenBalances: currentTokens.map((token: Token) => ({
            token,
            balanceMantissa: new BigNumber('10000000000000000000'),
          })),
        },
      }),
    );

    (useGetVTokenBalances as Mock).mockImplementation(
      ({ vTokens }: GetVTokenBalancesInput): { data: GetVTokenBalancesOutput } => ({
        data: {
          vTokenBalances: vTokens.map((vToken: VToken) => ({
            vToken,
            balanceMantissa: new BigNumber('10000000000000000000'),
          })),
        },
      }),
    );

    (useGetVenusVaiVaultDailyRate as Mock).mockReturnValue({
      data: dailyRateMantissa
        ? {
            dailyRateMantissa,
          }
        : undefined,
    });
  });

  it('returns the expected cells for the requested stats', () => {
    const { result } = renderHook(() =>
      usePoolStats({
        pools: poolData,
        stats: ['supply', 'borrow', 'liquidity', 'treasury', 'assetCount', 'dailyXvsDistribution'],
      }),
    );

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "label": "Total supply",
          "value": "$41.98T",
        },
        {
          "label": "Total borrow",
          "value": "$17.17T",
        },
        {
          "label": "Available liquidity",
          "value": "$24.8T",
        },
        {
          "label": "Treasury",
          "value": "$20.61T",
        },
        {
          "label": "Assets",
          "value": 8,
        },
        {
          "label": "Daily XVS distribution",
          "value": "159.99M XVS",
        },
      ]
    `);
  });

  it('only enables treasury and VAI vault queries when the corresponding stats are requested', () => {
    const { result } = renderHook(() =>
      usePoolStats({
        pools: [poolData[0]],
        stats: ['assetCount', 'supply'],
      }),
    );

    expect(useGetTokenBalances).toHaveBeenCalledWith(
      {
        accountAddress: altAddress,
        tokens,
      },
      {
        enabled: false,
      },
    );
    expect(useGetVTokenBalances).toHaveBeenCalledWith(
      {
        accountAddress: altAddress,
        vTokens: poolData[0].assets.map((asset: Asset) => asset.vToken),
      },
      {
        enabled: false,
      },
    );
    expect(useGetVenusVaiVaultDailyRate).toHaveBeenCalledWith({
      enabled: false,
    });
    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "label": "Assets",
          "value": 4,
        },
        {
          "label": "Total supply",
          "value": "$20.99T",
        },
      ]
    `);
  });
});

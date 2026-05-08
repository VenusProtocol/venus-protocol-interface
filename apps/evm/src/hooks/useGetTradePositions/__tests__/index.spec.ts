import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { useGetPools, useGetRawTradePositions } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { renderHook } from 'testUtils/render';
import type { Pool, TradePosition } from 'types';

import { tradePositions } from '__mocks__/models/trade';

import { useGetTradePositions } from '..';

const position = tradePositions[0];

const setApiHooks = ({
  getRawTradePositionsData = {
    positions: [position],
  },
  isGetRawTradePositionsLoading = false,
  getPoolsData = {
    pools: [position.pool],
  },
  isGetPoolsLoading = false,
}: {
  getRawTradePositionsData?: { positions: TradePosition[] };
  isGetRawTradePositionsLoading?: boolean;
  getPoolsData?: { pools: Pool[] };
  isGetPoolsLoading?: boolean;
} = {}) => {
  (useGetRawTradePositions as Mock).mockReturnValue({
    data: getRawTradePositionsData,
    isLoading: isGetRawTradePositionsLoading,
  });

  (useGetPools as Mock).mockReturnValue({
    data: getPoolsData,
    isLoading: isGetPoolsLoading,
  });
};

describe('useGetTradePositions', () => {
  beforeEach(() => {
    setApiHooks();
  });

  it('passes the expected query params when the wallet is disconnected', () => {
    const { result } = renderHook(() => useGetTradePositions({}));

    expect(useGetRawTradePositions).toHaveBeenCalledWith(
      {
        accountAddress: NULL_ADDRESS,
      },
      {
        enabled: false,
      },
    );
    expect(useGetPools).toHaveBeenCalledWith({
      accountAddress: undefined,
    });

    expect(result.current).toMatchSnapshot();
  });

  it('enriches positions with wallet balances from the connected wallet pool data', () => {
    const dsaWalletBalanceTokens = new BigNumber(11);
    const dsaWalletBalanceCents = new BigNumber(1111);
    const longWalletBalanceTokens = new BigNumber(22);
    const longWalletBalanceCents = new BigNumber(2222);
    const shortWalletBalanceTokens = new BigNumber(33);
    const shortWalletBalanceCents = new BigNumber(3333);

    setApiHooks({
      getPoolsData: {
        pools: [
          {
            ...position.pool,
            assets: position.pool.assets.map(asset => {
              const isDsaAsset = asset.vToken.address === position.dsaAsset.vToken.address;
              const isLongAsset = asset.vToken.address === position.longAsset.vToken.address;
              const isShortAsset = asset.vToken.address === position.shortAsset.vToken.address;

              return {
                ...asset,
                vToken: {
                  ...asset.vToken,
                  address: asset.vToken.address.toUpperCase() as typeof asset.vToken.address,
                },
                userWalletBalanceTokens: isDsaAsset
                  ? dsaWalletBalanceTokens
                  : isLongAsset
                    ? longWalletBalanceTokens
                    : isShortAsset
                      ? shortWalletBalanceTokens
                      : asset.userWalletBalanceTokens,
                userWalletBalanceCents: isDsaAsset
                  ? dsaWalletBalanceCents
                  : isLongAsset
                    ? longWalletBalanceCents
                    : isShortAsset
                      ? shortWalletBalanceCents
                      : asset.userWalletBalanceCents,
              };
            }),
          },
        ],
      },
    });

    const { result } = renderHook(() =>
      useGetTradePositions({
        accountAddress: fakeAccountAddress,
      }),
    );

    expect(result.current).toMatchSnapshot();
  });

  it('falls back to the raw Trade position balances when pool data is unavailable and preserves loading state', () => {
    setApiHooks({
      getPoolsData: undefined,
      isGetPoolsLoading: true,
    });

    const { result } = renderHook(() =>
      useGetTradePositions({
        accountAddress: fakeAccountAddress,
      }),
    );

    expect(result.current).toMatchSnapshot();
  });
});

import { QueryClient } from '@tanstack/react-query';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import FunctionKey from 'constants/functionKey';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import type { Address } from 'viem';
import { useGetCachedLiquidityHub } from '..';

const fakeAccountAddress: Address = '0x1000000000000000000000000000000000000001';

describe('useGetCachedLiquidityHub', () => {
  it('returns liquidity hub from cache when it exists', async () => {
    const fakeQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    fakeQueryClient.getQueriesData = (() => [
      [
        [FunctionKey.GET_LIQUIDITY_HUBS],
        {
          liquidityHubs,
        },
      ],
    ]) as any;

    const { result } = renderHook(
      () =>
        useGetCachedLiquidityHub({
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
          vhTokenAddress: liquidityHubs[0].vhToken.address.toLowerCase() as Address,
        }),
      {
        queryClient: fakeQueryClient,
      },
    );

    expect(result.current).toBe(liquidityHubs[0]);
  });

  it('returns undefined if liquidity hub does not exist in cache', async () => {
    const { result } = renderHook(() =>
      useGetCachedLiquidityHub({
        chainId: ChainId.BSC_TESTNET,
        vhTokenAddress: fakeAccountAddress,
      }),
    );

    expect(result.current).toBe(undefined);
  });
});

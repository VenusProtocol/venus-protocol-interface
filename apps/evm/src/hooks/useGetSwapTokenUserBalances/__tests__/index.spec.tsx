import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { useGetPool } from 'clients/api';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import { useGetSwapTokenUserBalances } from '..';

const fakePoolComptrollerContractAddress = '0xfakePoolComptrollerContractAddress' as Address;

describe('useGetSwapTokenUserBalances', () => {
  beforeEach(() => {
    (useGetPool as Mock).mockImplementation(() => ({
      data: undefined,
    }));
  });

  it('returns undefined when pool data is not available', () => {
    const { result } = renderHook(() =>
      useGetSwapTokenUserBalances({
        poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
        accountAddress: fakeAccountAddress,
      }),
    );

    expect(result.current.data).toBeUndefined();
  });

  it('filters out paused assets and returns mapped token balances', () => {
    (useGetPool as Mock).mockImplementation(() => ({
      data: {
        pool: {
          assets: [assetData[0], assetData[1]],
        },
      },
    }));

    const { result } = renderHook(() =>
      useGetSwapTokenUserBalances({
        poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
        accountAddress: fakeAccountAddress,
      }),
    );

    expect(result.current.data).toMatchSnapshot();
  });
});

import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { useGetPool } from 'clients/api';
import { renderHook } from 'testUtils/render';
import { useGetOperationFormTokenBalances } from '..';

vi.mock('clients/api', () => ({
  useGetPool: vi.fn(),
}));

describe('useGetOperationFormTokenBalances', () => {
  beforeEach(() => {
    (useGetPool as Mock).mockReturnValue({
      data: {
        pool: {
          assets: [],
        },
      },
    });
  });

  it('keeps the selected restricted asset, filters out other restricted assets, and preserves gated asset metadata', () => {
    const restrictedUnderlyingAsset = {
      ...assetData[0],
      disabledTokenActions: [],
      isRestricted: true,
      isGated: false,
    };
    const gatedAsset = {
      ...assetData[2],
      disabledTokenActions: [],
      isRestricted: false,
      isGated: true,
    };
    const restrictedNonUnderlyingAsset = {
      ...assetData[3],
      disabledTokenActions: [],
      isRestricted: true,
      isGated: false,
    };

    (useGetPool as Mock).mockReturnValue({
      data: {
        pool: {
          assets: [restrictedUnderlyingAsset, gatedAsset, restrictedNonUnderlyingAsset],
        },
      },
    });

    const { result } = renderHook(() =>
      useGetOperationFormTokenBalances({
        poolComptrollerContractAddress: fakeAccountAddress,
        accountAddress: fakeAccountAddress,
        underlyingToken: restrictedUnderlyingAsset.vToken.underlyingToken,
        isIntegratedSwapFeatureEnabled: true,
        canWrapNativeToken: false,
        action: 'supply',
      }),
    );

    expect(result.current.tokenBalances).toEqual([
      expect.objectContaining({
        token: restrictedUnderlyingAsset.vToken.underlyingToken,
        isGated: false,
        balanceMantissa: expect.any(BigNumber),
      }),
      expect.objectContaining({
        token: gatedAsset.vToken.underlyingToken,
        isGated: true,
        balanceMantissa: expect.any(BigNumber),
      }),
    ]);
  });
});

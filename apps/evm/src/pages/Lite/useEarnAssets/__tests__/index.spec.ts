import type { Mock } from 'vitest';

import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { renderHook } from 'testUtils/render';
import type { Asset, Pool } from 'types';

import { useEarnAssets } from '..';

const [isolatedAsset, pausedAsset, ...otherAssets] = poolData[0].assets;

const pool: Pool = {
  ...poolData[0],
  assets: [
    { ...isolatedAsset, collateralFactor: 0, isBorrowable: false, disabledTokenActions: [] },
    { ...pausedAsset, disabledTokenActions: ['supply', 'borrow'] },
    ...otherAssets,
  ] as Asset[],
  eModeGroups: [
    {
      id: 99,
      name: 'Isolated',
      isActive: true,
      isIsolated: true,
      assetSettings: [
        {
          vToken: isolatedAsset.vToken,
          collateralFactor: 0.5,
          liquidationThresholdPercentage: 60,
          liquidationPenaltyPercentage: 10,
          isBorrowable: false,
        },
      ],
    },
  ],
};

const getEarnTokenAddresses = (earnAssets: ReturnType<typeof useEarnAssets>['earnAssets']) =>
  earnAssets.flatMap(earnAsset =>
    earnAsset.markets.flatMap(market =>
      market.source.type === 'core' ? [market.source.asset.vToken.address] : [],
    ),
  );

describe('useEarnAssets', () => {
  beforeEach(() => {
    (useGetPool as Mock).mockReturnValue({ isLoading: false, data: { pool } });
  });

  it('lists a suppliable asset that has no collateral factor and only belongs to an isolated E-mode group', () => {
    const { result } = renderHook(() => useEarnAssets());

    expect(getEarnTokenAddresses(result.current.earnAssets)).toContain(
      isolatedAsset.vToken.address,
    );
  });

  it('hides paused assets', () => {
    const { result } = renderHook(() => useEarnAssets());

    expect(getEarnTokenAddresses(result.current.earnAssets)).not.toContain(
      pausedAsset.vToken.address,
    );
  });
});

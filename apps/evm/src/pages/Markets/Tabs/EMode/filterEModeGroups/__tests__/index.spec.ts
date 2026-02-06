import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { eModeGroups } from '__mocks__/models/eModeGroup';
import type { Asset, EModeGroup, Pool } from 'types';

import { poolData } from '__mocks__/models/pools';
import { filterEModeGroups } from '..';
import type { ExtendedEModeGroup } from '../../../types';

const extendGroup = (
  group: EModeGroup,
  overrides: Partial<ExtendedEModeGroup> = {},
): ExtendedEModeGroup => ({
  ...group,
  userBlockingBorrowPositions: [],
  userHasEnoughCollateral: true,
  hypotheticalUserHealthFactor: 1,
  ...overrides,
});

const stablecoinsGroup = extendGroup(eModeGroups[0]);
const defiGroup = extendGroup(eModeGroups[1]);

const makeAsset = (vTokenAddress: string, overrides: Partial<Asset> = {}): Asset => {
  const asset = assetData.find(asset => asset.vToken.address === vTokenAddress)!;

  return {
    ...asset,
    ...overrides,
  };
};

const fakePool = poolData[0];
const extendedEModeGroups: ExtendedEModeGroup[] = [stablecoinsGroup, defiGroup];

describe('filterEModeGroups', () => {
  it('includes groups when search matches the group name (case-insensitive)', () => {
    const result = filterEModeGroups({
      pool: fakePool,
      extendedEModeGroups,
      searchValue: 'stable',
      showPausedAssets: true,
      showUserAssetsOnly: false,
    });

    expect(result.map(g => g.id)).toEqual([stablecoinsGroup.id]);
  });

  it('filters groups based on underlying token symbol matches', () => {
    const result = filterEModeGroups({
      pool: fakePool,
      extendedEModeGroups,
      searchValue: 'uSdC',
      showPausedAssets: true,
      showUserAssetsOnly: false,
    });

    expect(result.map(g => g.id)).toEqual([stablecoinsGroup.id]);
  });

  it('excludes paused assets when showPausedAssets is false', () => {
    const customFakePool: Pool = {
      ...fakePool,
      assets: fakePool.assets.map(a => ({
        ...a,
        disabledTokenActions: ['borrow', 'supply'],
      })),
    };

    const hiddenResult = filterEModeGroups({
      pool: customFakePool,
      extendedEModeGroups,
      searchValue: '',
      showPausedAssets: false,
      showUserAssetsOnly: false,
    });

    expect(hiddenResult.map(g => g.id)).toEqual([]);

    const shownResult = filterEModeGroups({
      pool: customFakePool,
      extendedEModeGroups,
      searchValue: '',
      showPausedAssets: true,
      showUserAssetsOnly: false,
    });

    expect(shownResult.map(g => g.id)).toEqual([stablecoinsGroup.id, defiGroup.id]);
  });

  it('filters to user assets only when showUserAssetsOnly is true', () => {
    const nonUserAsset = makeAsset(defiGroup.assetSettings[0].vToken.address, {
      userSupplyBalanceCents: new BigNumber(0),
      userBorrowBalanceCents: new BigNumber(0),
      userWalletBalanceCents: new BigNumber(0),
    });

    const userAsset = makeAsset(stablecoinsGroup.assetSettings[0].vToken.address, {
      userWalletBalanceCents: new BigNumber(1),
    });

    const customFakePool: Pool = {
      ...fakePool,
      assets: [nonUserAsset, userAsset],
    };

    const result = filterEModeGroups({
      pool: customFakePool,
      extendedEModeGroups,
      searchValue: '',
      showPausedAssets: true,
      showUserAssetsOnly: true,
    });

    expect(result.map(g => g.id)).toEqual([stablecoinsGroup.id]);
  });
});

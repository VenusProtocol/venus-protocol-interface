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
  assetSettings: group.assetSettings.map(settings => ({
    ...settings,
    isPaused: false,
  })),
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

  it('excludes paused assets from groups when showPausedAssets is false', () => {
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

    expect(hiddenResult.map(g => g.id)).toEqual([stablecoinsGroup.id, defiGroup.id]);
    expect(hiddenResult.every(g => g.assetSettings.length === 0)).toBe(true);

    const shownResult = filterEModeGroups({
      pool: customFakePool,
      extendedEModeGroups,
      searchValue: '',
      showPausedAssets: true,
      showUserAssetsOnly: false,
    });

    expect(shownResult.map(g => g.id)).toEqual([stablecoinsGroup.id, defiGroup.id]);
  });

  it('hides the whole isolation group when its main asset is paused and showPausedAssets is false', () => {
    // eModeGroups[0] holds [XVS, USDC, USDT]; the label "XVS" matches XVS as its main asset.
    const isolationGroup = extendGroup(eModeGroups[0], {
      name: 'XVS',
      isIsolated: true,
      assetSettings: eModeGroups[0].assetSettings.map(settings => ({
        ...settings,
        isPaused: settings.vToken.underlyingToken.symbol === 'XVS',
      })),
    });

    const hiddenResult = filterEModeGroups({
      pool: fakePool,
      extendedEModeGroups: [isolationGroup, defiGroup],
      searchValue: '',
      showPausedAssets: false,
      showUserAssetsOnly: false,
    });

    // Whole group gone, only the unaffected group remains.
    expect(hiddenResult.map(g => g.id)).toEqual([defiGroup.id]);

    // Even a search matching a sibling asset keeps the group hidden.
    const searchResult = filterEModeGroups({
      pool: fakePool,
      extendedEModeGroups: [isolationGroup, defiGroup],
      searchValue: 'usdc',
      showPausedAssets: false,
      showUserAssetsOnly: false,
    });

    expect(searchResult.map(g => g.id)).toEqual([]);

    // Turning the toggle on brings the whole group back.
    const shownResult = filterEModeGroups({
      pool: fakePool,
      extendedEModeGroups: [isolationGroup, defiGroup],
      searchValue: '',
      showPausedAssets: true,
      showUserAssetsOnly: false,
    });

    expect(shownResult.map(g => g.id)).toContain(isolationGroup.id);
  });

  it('does not hide a non-isolated group even when its label matches a paused asset', () => {
    // Same XVS-paused setup with a matching "XVS" label, but the group is a regular
    // (non-isolated) e-mode group, so the whole-group hide rule must not apply.
    const nonIsolatedGroup = extendGroup(eModeGroups[0], {
      name: 'XVS',
      isIsolated: false,
      assetSettings: eModeGroups[0].assetSettings.map(settings => ({
        ...settings,
        isPaused: settings.vToken.underlyingToken.symbol === 'XVS',
      })),
    });

    const result = filterEModeGroups({
      pool: fakePool,
      extendedEModeGroups: [nonIsolatedGroup],
      searchValue: '',
      showPausedAssets: false,
      showUserAssetsOnly: false,
    });

    expect(result.map(g => g.id)).toEqual([nonIsolatedGroup.id]);
  });

  it('does not hide the group when the label matches no asset, even if an asset is paused', () => {
    // "Stablecoins" matches no asset symbol, so no main asset can be resolved.
    const groupWithPausedAsset = extendGroup(eModeGroups[0], {
      name: 'Stablecoins',
      isIsolated: true,
      assetSettings: eModeGroups[0].assetSettings.map(settings => ({
        ...settings,
        isPaused: settings.vToken.underlyingToken.symbol === 'XVS',
      })),
    });

    const result = filterEModeGroups({
      pool: fakePool,
      extendedEModeGroups: [groupWithPausedAsset],
      searchValue: '',
      showPausedAssets: false,
      showUserAssetsOnly: false,
    });

    expect(result.map(g => g.id)).toEqual([groupWithPausedAsset.id]);
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

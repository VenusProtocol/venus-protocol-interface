import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { poolData } from '__mocks__/models/pools';
import type { Asset, EModeGroup, Pool } from 'types';
import { formatEModeGroups } from '..';

const createEModeGroup = ({
  id,
  name,
  asset,
  isBorrowable,
  liquidationThresholdPercentage,
}: {
  id: number;
  name: string;
  asset: Asset;
  isBorrowable: boolean;
  liquidationThresholdPercentage: number;
}): EModeGroup => ({
  id,
  name,
  isActive: true,
  isIsolated: false,
  assetSettings: [
    {
      vToken: asset.vToken,
      collateralFactor: 0.5,
      liquidationThresholdPercentage,
      liquidationPenaltyPercentage: 0,
      isBorrowable,
    },
  ],
});

const createPool = ({
  groups,
  userEModeGroup,
}: {
  groups: EModeGroup[];
  userEModeGroup?: EModeGroup;
}): Pool => {
  const asset: Asset = {
    ...assetData[0],
    userBorrowBalanceCents: new BigNumber(100),
    userBorrowBalanceTokens: new BigNumber(1),
    userSupplyBalanceCents: new BigNumber(1000),
    userSupplyBalanceTokens: new BigNumber(10),
    userWalletBalanceCents: new BigNumber(0),
    isCollateralOfUser: true,
  };

  return {
    ...poolData[0],
    assets: [asset],
    eModeGroups: groups,
    userEModeGroup,
    vai: undefined,
  };
};

describe('formatEModeGroups', () => {
  it('sorts enabled first, then enableable groups by descending health factor, then blocked groups', () => {
    const asset = assetData[0];
    const enabledGroup = createEModeGroup({
      id: 1,
      name: 'Enabled blocked group',
      asset,
      isBorrowable: false,
      liquidationThresholdPercentage: 20,
    });
    const highHealthFactorGroup = createEModeGroup({
      id: 2,
      name: 'High health factor group',
      asset,
      isBorrowable: true,
      liquidationThresholdPercentage: 80,
    });
    const blockedGroup = createEModeGroup({
      id: 3,
      name: 'Blocked group',
      asset,
      isBorrowable: false,
      liquidationThresholdPercentage: 90,
    });
    const lowHealthFactorGroup = createEModeGroup({
      id: 4,
      name: 'Low health factor group',
      asset,
      isBorrowable: true,
      liquidationThresholdPercentage: 50,
    });
    const pool = createPool({
      groups: [enabledGroup, highHealthFactorGroup, blockedGroup, lowHealthFactorGroup],
      userEModeGroup: enabledGroup,
    });

    const result = formatEModeGroups({
      pool,
      eModeGroups: pool.eModeGroups,
      searchValue: '',
      showUserAssetsOnly: false,
      formatTo: vi.fn(({ to }) => to),
    });

    expect(result.map(group => group.name)).toEqual([
      enabledGroup.name,
      highHealthFactorGroup.name,
      lowHealthFactorGroup.name,
      blockedGroup.name,
    ]);
  });

  it.each([
    ['enableable group before blocked group', true],
    ['blocked group before enableable group', false],
  ])('sorts enableable groups before blocked groups when input has %s', (_, isEnableableFirst) => {
    const asset = assetData[0];
    const enableableGroup = createEModeGroup({
      id: 1,
      name: 'Enableable group',
      asset,
      isBorrowable: true,
      liquidationThresholdPercentage: 80,
    });
    const blockedGroup = createEModeGroup({
      id: 2,
      name: 'Blocked group',
      asset,
      isBorrowable: false,
      liquidationThresholdPercentage: 80,
    });
    const groups = isEnableableFirst
      ? [enableableGroup, blockedGroup]
      : [blockedGroup, enableableGroup];
    const pool = createPool({ groups });

    const result = formatEModeGroups({
      pool,
      eModeGroups: pool.eModeGroups,
      searchValue: '',
      showUserAssetsOnly: false,
      formatTo: vi.fn(({ to }) => to),
    });

    expect(result.map(group => group.name)).toEqual([enableableGroup.name, blockedGroup.name]);
  });
});

import { fireEvent, screen, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData as fakePools } from '__mocks__/models/pools';
import { spokePools } from '__mocks__/models/spokePools';
import { vaults } from '__mocks__/models/vaults';
import { useGetSpokePools } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { LiquidityHub, Pool, Vault } from 'types';
import { PoolPositions } from '..';

const poolWithNoPositions = {
  ...fakePools[0],
  assets: fakePools[0].assets.map(asset => ({
    ...asset,
    userSupplyBalanceTokens: asset.userSupplyBalanceTokens.multipliedBy(0),
    userBorrowBalanceTokens: asset.userBorrowBalanceTokens.multipliedBy(0),
    isCollateralOfUser: false,
  })),
};

const withSpokeDebt = (spokePool: (typeof spokePools)[number], borrowBalanceTokens: number) => ({
  ...spokePool,
  assets: spokePool.assets.map(asset => ({
    ...asset,
    userSupplyBalanceTokens: new BigNumber(0),
    userBorrowBalanceTokens: new BigNumber(asset.isBorrowable ? borrowBalanceTokens : 0),
  })),
});

const mockSpokePools = (pools: (typeof spokePools)[number][], isLoading = false) =>
  (useGetSpokePools as Mock).mockImplementation(() => ({
    isLoading,
    errorUpdateCount: 0,
    data: isLoading ? undefined : { spokePools: pools },
  }));

const otherSpokePool = {
  ...spokePools[0],
  name: 'Other Spoke Pool',
  comptrollerAddress: '0x0000000000000000000000000000000000000abc' as const,
};

const pills = () => within(screen.getByRole('group', { name: en.account.positions.label }));
const pill = (name: string) => pills().getByText(name).closest('button') as HTMLButtonElement;
const isPillActive = (name: string) => pill(name).dataset.venusButtonActive === 'true';
const hasHealthRing = (name: string) => !!within(pill(name)).queryByRole('img');

const render = ({
  pool,
  hubs = [],
  userVaults = [],
  isPoolLoading = false,
}: {
  pool: Pool;
  hubs?: LiquidityHub[];
  userVaults?: Vault[];
  isPoolLoading?: boolean;
}) =>
  renderComponent(
    <PoolPositions
      pool={pool}
      liquidityHubs={hubs}
      vaults={userVaults}
      isPoolLoading={isPoolLoading}
      isHubsLoading={false}
      isVaultsLoading={false}
    />,
    { accountAddress: fakeAccountAddress },
  );

describe('PoolPositions', () => {
  beforeEach(() => {
    mockSpokePools([]);
  });

  it('shows only the Core pool with a placeholder when the user has no position', () => {
    render({ pool: poolWithNoPositions });

    expect(isPillActive(en.account.spoke.corePoolPill)).toBe(true);
    expect(pills().queryByText(en.account.tabs.vaults)).not.toBeInTheDocument();
    expect(pills().queryByText(en.account.tabs.hubs)).not.toBeInTheDocument();
    expect(screen.getByText(en.account.pools.placeholder.title)).toBeInTheDocument();
  });

  it('shows a spinner instead of the placeholder while the Core pool loads', () => {
    render({ pool: poolWithNoPositions, isPoolLoading: true });

    expect(screen.queryByText(en.account.pools.placeholder.title)).not.toBeInTheDocument();
  });

  it('orders products with positions as Hubs, Core, then Vaults', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'liquidityHub',
    );

    render({ pool: fakePools[0], hubs: liquidityHubs, userVaults: vaults });

    expect(
      pills()
        .getAllByRole('button')
        .map(button => button.textContent),
    ).toEqual([en.account.tabs.hubs, en.account.spoke.corePoolPill, en.account.tabs.vaults]);
    expect(isPillActive(en.account.tabs.hubs)).toBe(true);
  });

  describe('with Spoke enabled', () => {
    beforeEach(() => {
      (useIsFeatureEnabled as Mock).mockImplementation(
        ({ name }: UseIsFeatureEnabledInput) => name === 'spoke',
      );
    });

    it('opens on the first Spoke pool when the user has no Core position', () => {
      mockSpokePools([withSpokeDebt(spokePools[0], 10)]);

      render({ pool: poolWithNoPositions });

      expect(screen.queryByText(en.account.pools.placeholder.title)).not.toBeInTheDocument();
      expect(isPillActive(spokePools[0].name)).toBe(true);
    });

    it('hides the Core pool when the user only has Spoke positions', () => {
      mockSpokePools([withSpokeDebt(spokePools[0], 10)]);

      render({ pool: poolWithNoPositions });

      expect(pills().queryByText(en.account.spoke.corePoolPill)).not.toBeInTheDocument();
    });

    it('opens on the Core pool when the user has a Core position', () => {
      mockSpokePools([withSpokeDebt(spokePools[0], 10)]);

      render({ pool: fakePools[0] });

      expect(isPillActive(en.account.spoke.corePoolPill)).toBe(true);
    });

    it('falls back to the default pill when the selected Spoke pool empties', () => {
      mockSpokePools([withSpokeDebt(spokePools[0], 10), withSpokeDebt(otherSpokePool, 10)]);

      const { rerender } = render({ pool: poolWithNoPositions });

      fireEvent.click(pill(otherSpokePool.name));
      expect(isPillActive(otherSpokePool.name)).toBe(true);

      mockSpokePools([withSpokeDebt(spokePools[0], 10), withSpokeDebt(otherSpokePool, 0)]);
      rerender(
        <PoolPositions
          pool={poolWithNoPositions}
          liquidityHubs={[]}
          vaults={[]}
          isPoolLoading={false}
          isHubsLoading={false}
          isVaultsLoading={false}
        />,
      );

      expect(pills().queryByText(otherSpokePool.name)).not.toBeInTheDocument();
      expect(isPillActive(spokePools[0].name)).toBe(true);
    });

    it('shows a health ring on unselected pools where the user borrows', () => {
      const supplyOnlySpokePool = {
        ...otherSpokePool,
        userBorrowBalanceCents: new BigNumber(0),
        assets: otherSpokePool.assets.map(asset => ({
          ...asset,
          userSupplyBalanceTokens: new BigNumber(asset.isBorrowable ? 0 : 10),
          userBorrowBalanceTokens: new BigNumber(0),
        })),
      };
      mockSpokePools([withSpokeDebt(spokePools[0], 10), supplyOnlySpokePool]);

      render({ pool: poolWithNoPositions });

      expect(isPillActive(spokePools[0].name)).toBe(true);
      expect(hasHealthRing(spokePools[0].name)).toBe(false);

      fireEvent.click(pill(supplyOnlySpokePool.name));

      expect(hasHealthRing(spokePools[0].name)).toBe(true);
      expect(hasHealthRing(supplyOnlySpokePool.name)).toBe(false);
    });
  });
});

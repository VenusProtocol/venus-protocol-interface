import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData as fakePools } from '__mocks__/models/pools';
import { spokePools } from '__mocks__/models/spokePools';
import { useGetSpokePools } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import { Markets } from '..';

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

const mockSpokePools = (pools: (typeof spokePools)[number][]) =>
  (useGetSpokePools as Mock).mockImplementation(() => ({
    isLoading: false,
    data: { spokePools: pools },
  }));

const otherSpokePool = {
  ...spokePools[0],
  name: 'Other Spoke Pool',
  comptrollerAddress: '0x0000000000000000000000000000000000000abc' as const,
};

const isPillActive = (name: string) =>
  screen.getByText(name).closest('button')?.classList.contains('border-blue');

describe('Markets', () => {
  it('displays content correctly', async () => {
    const { container } = renderComponent(<Markets pool={fakePools[0]} />);

    expect(container.textContent).toMatchSnapshot();
  });

  it('displays placeholder when user has no position in pool', async () => {
    const { container } = renderComponent(<Markets pool={poolWithNoPositions} />);

    expect(container.textContent).toMatchSnapshot();
  });

  describe('with Spoke enabled', () => {
    beforeEach(() => {
      (useIsFeatureEnabled as Mock).mockImplementation(
        ({ name }: UseIsFeatureEnabledInput) => name === 'spoke',
      );
    });

    it('opens on the first Spoke pool when the user has no Core position', () => {
      mockSpokePools([withSpokeDebt(spokePools[0], 10)]);

      renderComponent(<Markets pool={poolWithNoPositions} />, {
        accountAddress: fakeAccountAddress,
      });

      expect(screen.queryByText(en.account.pools.placeholder.title)).not.toBeInTheDocument();
      expect(isPillActive(spokePools[0].name)).toBe(true);
    });

    it('opens on the Core pool when the user has a Core position', () => {
      mockSpokePools([withSpokeDebt(spokePools[0], 10)]);

      renderComponent(<Markets pool={fakePools[0]} />, {
        accountAddress: fakeAccountAddress,
      });

      expect(isPillActive(en.account.spoke.corePoolPill)).toBe(true);
    });

    it('falls back to the first pill when the selected Spoke pool empties', () => {
      mockSpokePools([withSpokeDebt(spokePools[0], 10), withSpokeDebt(otherSpokePool, 10)]);

      const { rerender } = renderComponent(<Markets pool={poolWithNoPositions} />, {
        accountAddress: fakeAccountAddress,
      });

      fireEvent.click(screen.getByText(otherSpokePool.name));
      expect(isPillActive(otherSpokePool.name)).toBe(true);

      mockSpokePools([withSpokeDebt(spokePools[0], 10), withSpokeDebt(otherSpokePool, 0)]);
      rerender(<Markets pool={poolWithNoPositions} />);

      expect(screen.queryByText(otherSpokePool.name)).not.toBeInTheDocument();
      expect(isPillActive(spokePools[0].name)).toBe(true);
    });
  });
});

import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import { xvs } from '__mocks__/models/tokens';
import { useGetSpokePools } from 'clients/api';
import { useBreakpointUp } from 'hooks/responsive';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import SpokePools from '..';

vi.mock('hooks/responsive', async importOriginal => ({
  ...(await importOriginal<typeof import('hooks/responsive')>()),
  useBreakpointUp: vi.fn(() => true),
}));

const spokePool = spokePools[0];
const collateral = spokePool.assets.find(({ isBorrowable }) => !isBorrowable)!;

const withBalances = ({
  collateralWalletTokens,
  loanWalletTokens,
}: {
  collateralWalletTokens: number;
  loanWalletTokens: number;
}) => ({
  ...spokePool,
  assets: spokePool.assets.map(asset => ({
    ...asset,
    userSupplyBalanceTokens: new BigNumber(0),
    userBorrowBalanceTokens: new BigNumber(0),
    userWalletBalanceTokens: new BigNumber(
      asset.isBorrowable ? loanWalletTokens : collateralWalletTokens,
    ),
  })),
});

const mockSpokePools = (pools: (typeof spokePools)[number][]) =>
  (useGetSpokePools as Mock).mockImplementation(() => ({
    isLoading: false,
    data: {
      spokePools: pools,
      totals: {
        poolCount: pools.length,
        totalBorrowCents: new BigNumber(0),
        availableLiquidityCents: new BigNumber(0),
      },
    },
  }));

const otherSpokePool = {
  ...spokePool,
  name: 'Other pool',
  comptrollerAddress: '0x0000000000000000000000000000000000000003' as const,
  assets: spokePool.assets.map(asset =>
    asset.isBorrowable
      ? asset
      : {
          ...asset,
          vToken: {
            ...asset.vToken,
            address: '0x0000000000000000000000000000000000000004' as const,
            underlyingToken: xvs,
          },
        },
  ),
};

const showUserAssetsOnly = () =>
  (useUserChainSettings as Mock).mockImplementation(() => [
    { ...defaultUserChainSettings, showUserSpokeAssetsOnly: true },
    vi.fn(),
  ]);

describe('SpokePools', () => {
  it('hides a pool where the user only holds a loan asset when showing their assets only', () => {
    showUserAssetsOnly();
    mockSpokePools([withBalances({ collateralWalletTokens: 0, loanWalletTokens: 1000 })]);

    renderComponent(<SpokePools />, { accountAddress: fakeAccountAddress });

    expect(screen.queryByText(spokePool.name)).not.toBeInTheDocument();
  });

  it('offers to reset filters when only the user assets toggle hides every pool', () => {
    showUserAssetsOnly();
    mockSpokePools([withBalances({ collateralWalletTokens: 0, loanWalletTokens: 0 })]);

    renderComponent(<SpokePools />, { accountAddress: fakeAccountAddress });

    expect(screen.queryByText(spokePool.name)).not.toBeInTheDocument();
    expect(screen.getByText(en.spokePools.filter.noResults)).toBeInTheDocument();
    expect(screen.getByText(en.noResults.resetFilters)).toBeInTheDocument();
  });

  it('turns off the user assets toggle when resetting filters', () => {
    const setUserChainSettingsMock = vi.fn();
    (useUserChainSettings as Mock).mockImplementation(() => [
      { ...defaultUserChainSettings, showUserSpokeAssetsOnly: true },
      setUserChainSettingsMock,
    ]);
    mockSpokePools([withBalances({ collateralWalletTokens: 1000, loanWalletTokens: 0 })]);

    renderComponent(<SpokePools />, { accountAddress: fakeAccountAddress });

    fireEvent.change(screen.getByPlaceholderText(en.spokePools.filter.searchPlaceholder), {
      target: { value: 'unknown' },
    });
    fireEvent.click(screen.getByText(en.noResults.resetFilters));

    expect(setUserChainSettingsMock).toHaveBeenCalledWith({ showUserSpokeAssetsOnly: false });
  });

  it('keeps a pool where the user holds its collateral when showing their assets only', () => {
    showUserAssetsOnly();
    mockSpokePools([withBalances({ collateralWalletTokens: 10, loanWalletTokens: 0 })]);

    renderComponent(<SpokePools />, { accountAddress: fakeAccountAddress });

    expect(screen.getByText(spokePool.name)).toBeInTheDocument();
  });

  it('keeps a pool where the user only has a debt when showing their assets only', () => {
    showUserAssetsOnly();
    mockSpokePools([
      {
        ...spokePool,
        assets: spokePool.assets.map(asset => ({
          ...asset,
          userSupplyBalanceTokens: new BigNumber(0),
          userWalletBalanceTokens: new BigNumber(0),
          userBorrowBalanceTokens: new BigNumber(asset.isBorrowable ? 10 : 0),
        })),
      },
    ]);

    renderComponent(<SpokePools />, { accountAddress: fakeAccountAddress });

    expect(screen.getByText(spokePool.name)).toBeInTheDocument();
  });

  it('opens the collateral modal when clicking a collateral in the popover', async () => {
    (useUserChainSettings as Mock).mockImplementation(() => [defaultUserChainSettings, vi.fn()]);
    const secondCollateral = {
      ...collateral,
      vToken: {
        ...collateral.vToken,
        address: '0x0000000000000000000000000000000000000002' as const,
        underlyingToken: xvs,
      },
    };
    mockSpokePools([{ ...spokePool, assets: [...spokePool.assets, secondCollateral] }]);

    renderComponent(<SpokePools />, { accountAddress: fakeAccountAddress });

    fireEvent.click(screen.getAllByAltText(xvs.symbol)[0]);

    const xvsRows = await waitFor(() => {
      const rows = screen.getAllByText(xvs.symbol);
      expect(rows.length).toBeGreaterThan(0);
      return rows;
    });
    fireEvent.click(xvsRows[xvsRows.length - 1]);

    await waitFor(() =>
      expect(
        screen.getByText(en.spokeForm.collateralModalTitle.replace('{{poolName}}', spokePool.name)),
      ).toBeInTheDocument(),
    );
  });

  it('applies the collateral filter from the URL from the sm breakpoint up', () => {
    (useUserChainSettings as Mock).mockImplementation(() => [defaultUserChainSettings, vi.fn()]);
    mockSpokePools([spokePool, otherSpokePool]);

    renderComponent(<SpokePools />, {
      routerInitialEntries: [`/?collateral=${collateral.vToken.underlyingToken.symbol}`],
    });

    expect(screen.getByText(en.spokePools.filter.allLoanAssets)).toBeInTheDocument();
    expect(screen.getByText(spokePool.name)).toBeInTheDocument();
    expect(screen.queryByText(otherSpokePool.name)).not.toBeInTheDocument();
  });

  it('only shows the pool filter and ignores the other filters below the sm breakpoint', () => {
    (useBreakpointUp as Mock).mockReturnValue(false);
    (useUserChainSettings as Mock).mockImplementation(() => [defaultUserChainSettings, vi.fn()]);
    mockSpokePools([spokePool, otherSpokePool]);

    renderComponent(<SpokePools />, {
      routerInitialEntries: [`/?collateral=${collateral.vToken.underlyingToken.symbol}`],
    });

    expect(screen.queryByText(en.spokePools.filter.allLoanAssets)).not.toBeInTheDocument();
    expect(screen.queryByText(en.spokePools.filter.allCollaterals)).not.toBeInTheDocument();
    expect(screen.getByText(en.spokePools.filter.allPools)).toBeInTheDocument();
    expect(screen.getByText(spokePool.name)).toBeInTheDocument();
    expect(screen.getByText(otherSpokePool.name)).toBeInTheDocument();
  });
});

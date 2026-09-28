import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { spokePools } from '__mocks__/models/spokePools';
import { xvs } from '__mocks__/models/tokens';
import { useGetSpokePools } from 'clients/api';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import SpokePools from '..';

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

const showUserAssetsOnly = () =>
  (useUserChainSettings as Mock).mockImplementation(() => [
    { ...defaultUserChainSettings, showUserAssetsOnly: true },
    vi.fn(),
  ]);

describe('SpokePools', () => {
  it('hides a pool where the user only holds a loan asset when showing their assets only', () => {
    showUserAssetsOnly();
    mockSpokePools([withBalances({ collateralWalletTokens: 0, loanWalletTokens: 1000 })]);

    renderComponent(<SpokePools />, { accountAddress: fakeAccountAddress });

    expect(screen.queryByText(spokePool.name)).not.toBeInTheDocument();
  });

  it('keeps a pool where the user holds its collateral when showing their assets only', () => {
    showUserAssetsOnly();
    mockSpokePools([withBalances({ collateralWalletTokens: 10, loanWalletTokens: 0 })]);

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
});

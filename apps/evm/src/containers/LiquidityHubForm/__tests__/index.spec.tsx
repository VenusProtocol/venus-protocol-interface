import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { useGetBalanceOf, useGetPool } from 'clients/api';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { convertTokensToMantissa } from 'utilities';

import { LiquidityHubForm } from '..';

const liquidityHub = liquidityHubs[0];
const corePool = poolData[0];
const walletBalanceMantissa = convertTokensToMantissa({
  value: liquidityHub.userWalletBalanceTokens ?? new BigNumber(0),
  token: liquidityHub.vhToken.underlyingToken,
});

const makeUseTokenApprovalOutput = (overrides: Partial<ReturnType<typeof useTokenApproval>> = {}) =>
  ({
    isTokenApproved: true,
    isWalletSpendingLimitLoading: false,
    isApproveTokenLoading: false,
    isRevokeWalletSpendingLimitLoading: false,
    walletSpendingLimitTokens: new BigNumber(40),
    approveToken: vi.fn().mockResolvedValue(undefined),
    revokeWalletSpendingLimit: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }) as ReturnType<typeof useTokenApproval>;

const renderLiquidityHubForm = (
  props: Partial<React.ComponentProps<typeof LiquidityHubForm>> = {},
  options?: Parameters<typeof renderComponent>[1],
) =>
  renderComponent(<LiquidityHubForm vhToken={liquidityHub.vhToken} {...props} />, {
    accountAddress: fakeAccountAddress,
    ...options,
  });

const expectWithdrawFormToBeRendered = () => {
  expect(
    screen.getByRole('button', {
      name: en.liquidityHubForm.rightMaxButtonLabel,
    }),
  ).toBeInTheDocument();
  expect(screen.getByText(en.availableBalance.label)).toBeInTheDocument();
  expect(
    screen.getAllByRole('button', {
      name: en.liquidityHubForm.withdrawSubmitButtonLabel,
    }),
  ).toHaveLength(2);
};

describe('LiquidityHubForm', () => {
  const mockUseGetBalanceOf = useGetBalanceOf as Mock;
  const mockUseGetPool = useGetPool as Mock;
  const mockUseSimulatePoolMutations = useSimulatePoolMutations as Mock;
  const mockUseTokenApproval = useTokenApproval as Mock;

  beforeEach(() => {
    mockUseGetBalanceOf.mockReturnValue({
      data: {
        balanceMantissa: walletBalanceMantissa,
      },
      isLoading: false,
    });

    mockUseGetPool.mockImplementation(() => ({
      data: {
        pool: corePool,
      },
      isLoading: false,
    }));

    mockUseSimulatePoolMutations.mockImplementation(({ pool }: { pool?: Pool }) => ({
      data: {
        pool,
      },
    }));

    mockUseTokenApproval.mockReturnValue(makeUseTokenApprovalOutput());
  });

  it('renders the top-level tabs and default supply content', () => {
    renderLiquidityHubForm();

    expect(
      screen.getAllByRole('button', {
        name: en.liquidityHubForm.supplyTabTitle,
      }),
    ).toHaveLength(2);
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.withdrawTabTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplyTab.walletTabTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplyTab.collateralTabTitle,
      }),
    ).toBeInTheDocument();
  });

  it('renders the withdraw form after switching to the withdraw tab', () => {
    renderLiquidityHubForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.withdrawTabTitle,
      }),
    );

    expectWithdrawFormToBeRendered();
  });

  it('starts on the withdraw tab when requested', () => {
    renderLiquidityHubForm({
      initialActiveTabId: 'withdraw',
    });

    expectWithdrawFormToBeRendered();
  });

  it('uses search params for tab state when navType is searchParam', async () => {
    renderLiquidityHubForm(
      {
        navType: 'searchParam',
      },
      {
        routerInitialEntries: ['/?tab=withdraw'],
      },
    );

    await waitFor(expectWithdrawFormToBeRendered);
  });
});

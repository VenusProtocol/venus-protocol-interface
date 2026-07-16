import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { useGetPool } from 'clients/api';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';

import { LiquidityHubForm } from '..';

const liquidityHub = liquidityHubs[0];
const corePool = poolData[0];

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

describe('LiquidityHubForm', () => {
  const mockUseGetPool = useGetPool as Mock;
  const mockUseSimulatePoolMutations = useSimulatePoolMutations as Mock;
  const mockUseTokenApproval = useTokenApproval as Mock;

  beforeEach(() => {
    mockUseGetPool.mockImplementation(() => ({
      data: {
        pool: corePool,
      },
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
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplyTabTitle,
      }),
    ).toBeInTheDocument();
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

  it('renders the current withdraw placeholder for the matching Liquidity Hub', () => {
    renderLiquidityHubForm();

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.withdrawTabTitle,
      }),
    );

    expect(screen.getByText(liquidityHub.hubAddress)).toBeInTheDocument();
  });

  it('starts on the withdraw tab when requested', () => {
    renderLiquidityHubForm({
      initialActiveTabId: 'withdraw',
    });

    expect(screen.getByText(liquidityHub.hubAddress)).toBeInTheDocument();
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

    await waitFor(() => expect(screen.getByText(liquidityHub.hubAddress)).toBeInTheDocument());
  });
});

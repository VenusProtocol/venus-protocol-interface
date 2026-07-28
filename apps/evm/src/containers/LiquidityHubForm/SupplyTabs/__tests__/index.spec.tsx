import { fireEvent, screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { useGetBalanceOf, useGetPool } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { Pool } from 'types';
import { convertTokensToMantissa } from 'utilities';

import { SupplyTabs } from '..';

const liquidityHub = liquidityHubs[0];
const corePool = poolData[0];
const corePoolAsset = assetData[0];
const liquidityHubMigratorContractAddress = '0xfakeLiquidityHubMigratorContractAddress';
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

const renderSupplyTabs = (props: Partial<React.ComponentProps<typeof SupplyTabs>> = {}) =>
  renderComponent(<SupplyTabs liquidityHub={liquidityHub} {...props} />, {
    accountAddress: fakeAccountAddress,
  });

describe('SupplyTabs', () => {
  const mockUseGetBalanceOf = useGetBalanceOf as Mock;
  const mockUseGetPool = useGetPool as Mock;
  const mockUseGetContractAddress = useGetContractAddress as Mock;
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

    mockUseGetContractAddress.mockReturnValue({
      address: liquidityHubMigratorContractAddress,
    });

    mockUseSimulatePoolMutations.mockImplementation(({ pool }: { pool?: Pool }) => ({
      data: {
        pool,
      },
    }));

    mockUseTokenApproval.mockReturnValue(makeUseTokenApprovalOutput());
  });

  it('renders a spinner while loading the core pool', () => {
    mockUseGetPool.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderSupplyTabs();

    expect(screen.getByAltText('Spinner')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: en.liquidityHubForm.supplyTab.collateralTabTitle,
      }),
    ).not.toBeInTheDocument();
  });

  it('renders only the wallet supply form when the core pool is missing', () => {
    mockUseGetPool.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    renderSupplyTabs();

    expect(
      screen.queryByRole('button', {
        name: en.liquidityHubForm.supplyTab.collateralTabTitle,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplySubmitButtonLabel,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(en.trade.operationForm.walletBalance)).toBeInTheDocument();
  });

  it('renders only the wallet supply form when no matching core pool asset is found', () => {
    const poolWithoutMatchingAsset = {
      ...corePool,
      assets: [assetData[1]],
    };

    mockUseGetPool.mockReturnValue({
      data: {
        pool: poolWithoutMatchingAsset,
      },
      isLoading: false,
    });

    renderSupplyTabs();

    expect(
      screen.queryByRole('button', {
        name: en.liquidityHubForm.supplyTab.collateralTabTitle,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplySubmitButtonLabel,
      }),
    ).toBeInTheDocument();
  });

  it('renders only the wallet supply form when the migrator contract is unavailable', () => {
    mockUseGetContractAddress.mockReturnValue({
      address: undefined,
    });

    renderSupplyTabs();

    expect(
      screen.queryByRole('button', {
        name: en.liquidityHubForm.supplyTab.collateralTabTitle,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplySubmitButtonLabel,
      }),
    ).toBeInTheDocument();
  });

  it('renders wallet and collateral tabs when collateral supply is available', () => {
    renderSupplyTabs();

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

  it('renders collateral form after switching to the collateral tab', () => {
    renderSupplyTabs();

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplyTab.collateralTabTitle,
      }),
    );

    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.rightSafeMaxButtonLabel,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplySubmitButtonLabel,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(en.availableBalance.label)).toBeInTheDocument();
    expect(screen.getByText(en.spendingLimit.label)).toBeInTheDocument();
    expect(mockUseTokenApproval).toHaveBeenCalledWith({
      token: corePoolAsset.vToken,
      spenderAddress: liquidityHubMigratorContractAddress,
      accountAddress: fakeAccountAddress,
    });
  });
});

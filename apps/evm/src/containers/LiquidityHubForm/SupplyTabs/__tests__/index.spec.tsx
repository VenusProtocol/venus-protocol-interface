import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { useGetBalanceOf, useGetPool } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
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

  it.each([
    [true, '0xfakeCollateralGatewayContractAddress'],
    [false, liquidityHub.vhToken.address],
  ])(
    'routes wallet supplies through the collateral gateway only when auto-resupply is enabled (%s)',
    (isAutoResupplyEnabled, expectedSpenderAddress) => {
      const corePoolVhAsset = {
        ...assetData[1],
        vToken: {
          ...assetData[1].vToken,
          underlyingToken: liquidityHub.vhToken,
        },
        disabledTokenActions: [],
      };

      mockUseGetPool.mockReturnValue({
        data: {
          pool: {
            ...corePool,
            assets: [...corePool.assets, corePoolVhAsset],
          },
        },
        isLoading: false,
      });
      mockUseGetContractAddress.mockImplementation(({ name }: { name: string }) => ({
        address: `0xfake${name}ContractAddress`,
      }));
      (useIsFeatureEnabled as Mock).mockImplementation(
        ({ name }: { name: string }) =>
          name === 'liquidityHubAutoResupply' && isAutoResupplyEnabled,
      );

      renderSupplyTabs();

      expect(mockUseTokenApproval).toHaveBeenCalledWith({
        token: liquidityHub.vhToken.underlyingToken,
        spenderAddress: expectedSpenderAddress,
        accountAddress: fakeAccountAddress,
      });
    },
  );

  it('shows no minimum amount error when the collateral amount is 0', async () => {
    renderSupplyTabs();

    fireEvent.click(
      screen.getByRole('button', {
        name: en.liquidityHubForm.supplyTab.collateralTabTitle,
      }),
    );
    fireEvent.change(document.querySelector('input[name="amountTokens"]') as HTMLInputElement, {
      target: { value: '0' },
    });

    await waitFor(() =>
      expect(screen.queryByText(/You can not migrate less than/)).not.toBeInTheDocument(),
    );
  });

  describe('auto-resupply', () => {
    const collateralGatewayContractAddress = '0xfakeCollateralGatewayContractAddress';
    const coreVhAsset = {
      ...corePoolAsset,
      vToken: {
        ...corePoolAsset.vToken,
        address: '0xfakeVhMarketAddress' as const,
        underlyingToken: liquidityHub.vhToken,
      },
    };

    const renderWithCoreVhAsset = (
      disabledTokenActions: typeof coreVhAsset.disabledTokenActions,
    ) => {
      (useIsFeatureEnabled as Mock).mockReturnValue(true);
      mockUseGetContractAddress.mockImplementation(({ name }: { name: string }) => ({
        address:
          name === 'CollateralGateway'
            ? collateralGatewayContractAddress
            : liquidityHubMigratorContractAddress,
      }));
      mockUseGetPool.mockImplementation(() => ({
        data: {
          pool: {
            ...corePool,
            assets: [...corePool.assets, { ...coreVhAsset, disabledTokenActions }],
          },
        },
        isLoading: false,
      }));

      renderSupplyTabs();
    };

    it('supplies through the collateral gateway when the Core vhToken market is active', () => {
      renderWithCoreVhAsset([]);

      expect(mockUseTokenApproval).toHaveBeenCalledWith(
        expect.objectContaining({ spenderAddress: collateralGatewayContractAddress }),
      );
    });

    it('falls back to the plain Hub supply when the Core vhToken market has supply paused', () => {
      renderWithCoreVhAsset(['supply']);

      expect(mockUseTokenApproval).not.toHaveBeenCalledWith(
        expect.objectContaining({ spenderAddress: collateralGatewayContractAddress }),
      );
      expect(mockUseTokenApproval).toHaveBeenCalledWith(
        expect.objectContaining({ spenderAddress: liquidityHub.vhToken.address }),
      );
    });

    it('uses an active Core vhToken market when another one has supply paused', () => {
      (useIsFeatureEnabled as Mock).mockReturnValue(true);
      mockUseGetContractAddress.mockImplementation(({ name }: { name: string }) => ({
        address:
          name === 'CollateralGateway'
            ? collateralGatewayContractAddress
            : liquidityHubMigratorContractAddress,
      }));
      mockUseGetPool.mockImplementation(() => ({
        data: {
          pool: {
            ...corePool,
            assets: [
              ...corePool.assets,
              { ...coreVhAsset, disabledTokenActions: ['supply'] },
              {
                ...coreVhAsset,
                vToken: { ...coreVhAsset.vToken, address: '0xfakeActiveVhMarketAddress' },
                disabledTokenActions: [],
              },
            ],
          },
        },
        isLoading: false,
      }));

      renderSupplyTabs();

      expect(mockUseTokenApproval).toHaveBeenCalledWith(
        expect.objectContaining({ spenderAddress: collateralGatewayContractAddress }),
      );
    });

    it('falls back to the plain Hub supply when entering the Core vhToken market is paused', () => {
      renderWithCoreVhAsset(['enterMarket']);

      expect(mockUseTokenApproval).not.toHaveBeenCalledWith(
        expect.objectContaining({ spenderAddress: collateralGatewayContractAddress }),
      );
    });
  });
});

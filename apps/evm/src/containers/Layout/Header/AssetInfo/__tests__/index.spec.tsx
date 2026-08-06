import { fireEvent, screen, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { assetData } from '__mocks__/models/asset';
import { poolData } from '__mocks__/models/pools';
import { useGetAsset, useGetPool, useGetVTokenUtilizationRate } from 'clients/api';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { routes } from 'constants/routing';
import { renderComponent } from 'testUtils/render';
import { AssetInfo } from '..';

const scrollToElementMock = vi.hoisted(() => vi.fn());

vi.mock('utilities', async () => {
  const actual = await vi.importActual<typeof import('utilities')>('utilities');

  return {
    ...actual,
    scrollToElement: scrollToElementMock,
  };
});

const fakeAsset = {
  ...assetData[0],
  collateralFactor: 0.5,
  userCollateralFactor: 0.42,
};

const fakePool = {
  ...poolData[0],
  eModeGroups: [
    {
      ...poolData[0].eModeGroups[0],
      assetSettings: [
        {
          ...poolData[0].eModeGroups[0].assetSettings[0],
          vToken: fakeAsset.vToken,
        },
      ],
    },
  ],
};

const renderAssetInfo = ({ accountAddress }: { accountAddress?: string } = {}) =>
  renderComponent(<AssetInfo />, {
    accountAddress,
    routePath: routes.market.path,
    routerInitialEntries: [`/markets/${fakePool.comptrollerAddress}/${fakeAsset.vToken.address}`],
  });

describe('AssetInfo', () => {
  beforeEach(() => {
    scrollToElementMock.mockClear();
    (useGetAsset as Mock).mockReturnValue({
      data: {
        asset: fakeAsset,
      },
    });
    (useGetPool as Mock).mockReturnValue({
      data: {
        pool: fakePool,
      },
    });
    (useGetVTokenUtilizationRate as Mock).mockReturnValue({
      data: {
        utilizationRatePercentage: new BigNumber(12.34),
      },
    });
  });

  it('renders token info cells when asset and pool data exist', async () => {
    renderAssetInfo();

    expect(screen.getByText(fakeAsset.vToken.underlyingToken.symbol)).toBeInTheDocument();
    expect(screen.getByText('Supply')).toBeInTheDocument();
    expect(screen.getByText('Liquidity')).toBeInTheDocument();
    expect(screen.getByText('Max LTV')).toBeInTheDocument();
    expect(screen.getByText('Utilization rate')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('12.34%')).toBeInTheDocument();
  });

  it('uses user collateral factor when wallet is connected', () => {
    renderAssetInfo({
      accountAddress: '0x0000000000000000000000000000000000000001',
    });

    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('renders protection mode indicator when enabled', () => {
    (useGetAsset as Mock).mockReturnValue({
      data: {
        asset: {
          ...fakeAsset,
          isProtectionModeEnabled: true,
        },
      },
    });

    renderAssetInfo();

    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  it('renders placeholder utilization when asset or pool is missing', () => {
    (useGetPool as Mock).mockReturnValue({ data: undefined });

    renderAssetInfo();

    expect(screen.getAllByText(PLACEHOLDER_KEY).length).toBeGreaterThan(0);
  });

  it('mode-info link scrolls to the mode-info section', async () => {
    const { container } = renderAssetInfo();

    fireEvent.click(container.querySelector('[data-state]') as HTMLElement);
    fireEvent.click(await screen.findByText('Explore'));

    await waitFor(() => expect(scrollToElementMock).toHaveBeenCalledWith('mode-info'));
  });
});

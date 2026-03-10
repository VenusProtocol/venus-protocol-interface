import { fireEvent, screen } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import BigNumber from 'bignumber.js';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import type { UserChainSettings } from 'store';
import { renderComponent } from 'testUtils/render';
import type { Pool, TokenAction } from 'types';
import type { Mock } from 'vitest';
import { MarketTable } from '../index';
import type { ColumnKey } from '../types';

vi.mock('hooks/useCollateral');
vi.mock('pages/Market/OperationForm', () => ({
  OperationForm: () => <div data-testid="operation-form">Operation form</div>,
}));

const columns: ColumnKey[] = ['asset', 'supplyApy', 'borrowApy', 'collateral', 'userWalletBalance'];

const fakePausedPool: Pool = {
  ...poolData[0],
  assets: poolData[0].assets.map(asset => ({
    ...asset,
    disabledTokenActions: ['supply', 'borrow'] as TokenAction[],
  })),
};

describe('MarketTable', () => {
  it('renders with pool data', () => {
    const { container } = renderComponent(
      <MarketTable
        assets={poolData[0].assets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('hides controls when they are disabled', () => {
    renderComponent(
      <MarketTable
        assets={poolData[0].assets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
        controls={false}
      />,
    );

    expect(screen.queryByPlaceholderText(en.marketTable.search.placeholder)).toBeNull();
  });

  it('filters by search input', () => {
    const { container } = renderComponent(
      <MarketTable
        assets={poolData[0].assets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
    );

    const searchInput = screen.getByPlaceholderText(en.marketTable.search.placeholder);

    fireEvent.change(searchInput, { target: { value: 'busd' } });

    expect(container.textContent).toMatchSnapshot();
  });

  it('shows paused assets toggle if controls are enabled and any asset is paused', () => {
    renderComponent(
      <MarketTable
        assets={fakePausedPool.assets}
        poolName={fakePausedPool.name}
        poolComptrollerContractAddress={fakePausedPool.comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
    );

    expect(screen.getByText(en.controls.pausedAssetsToggle.label)).toBeInTheDocument();

    // Check empty state is displayed
    expect(screen.getByText(en.marketTable.pausedAssetsPlaceholder.title)).toBeInTheDocument();
  });

  it('shows paused assets if controls are enabled and corresponding toggle is enabled', () => {
    const fakeUserChainSettings: UserChainSettings = {
      ...defaultUserChainSettings,
      showPausedAssets: true,
    };
    (useUserChainSettings as Mock).mockReturnValue([fakeUserChainSettings, vi.fn()]);

    const { container } = renderComponent(
      <MarketTable
        assets={fakePausedPool.assets}
        poolName={fakePausedPool.name}
        poolComptrollerContractAddress={fakePausedPool.comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('shows user assets only if controls are enabled and corresponding toggle is enabled', () => {
    const mockSetUserChainSettings = vi.fn();

    const fakeUserChainSettings: UserChainSettings = {
      ...defaultUserChainSettings,
      showUserAssetsOnly: true,
    };

    (useUserChainSettings as Mock).mockReturnValue([
      fakeUserChainSettings,
      mockSetUserChainSettings,
    ]);

    // Patch asset to change user wallet balance to 0
    const fakePool: Pool = {
      ...poolData[0],
      assets: poolData[0].assets.map((asset, index) =>
        index === 0
          ? {
              ...asset,
              userWalletBalanceTokens: new BigNumber(0),
              userWalletBalanceCents: new BigNumber(0),
            }
          : asset,
      ),
    };

    const { container } = renderComponent(
      <MarketTable
        assets={fakePool.assets}
        poolName={fakePool.name}
        poolComptrollerContractAddress={fakePool.comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(screen.getByText(en.controls.userAssetsOnlyToggle.label)).toBeInTheDocument();

    expect(container.textContent).toMatchSnapshot();

    // Check switching off toggle calls callback correctly
    const [userAssetsOnlyToggle] = screen.getAllByRole('checkbox');

    fireEvent.click(userAssetsOnlyToggle);

    expect(mockSetUserChainSettings).toHaveBeenCalledTimes(1);
    expect(mockSetUserChainSettings).toHaveBeenCalledWith({
      showUserAssetsOnly: !fakeUserChainSettings.showUserAssetsOnly,
    });
  });

  it('opens operation modal when clicking on row control button', async () => {
    const { container } = renderComponent(
      <MarketTable
        assets={poolData[0].assets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
    );

    expect(screen.queryByTestId('operation-form')).toBeNull();

    const rowControlButton = container.querySelector('tbody button');
    expect(rowControlButton).not.toBeNull();

    fireEvent.click(rowControlButton as HTMLButtonElement);

    expect(await screen.findByTestId('operation-form')).toBeInTheDocument();
  });
});

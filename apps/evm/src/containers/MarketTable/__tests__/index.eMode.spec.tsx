import { fireEvent, screen } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import type { UserChainSettings } from 'store';
import { renderComponent } from 'testUtils/render';
import type { Asset } from 'types';
import type { Mock } from 'vitest';
import { MarketTable } from '../index';
import type { ColumnKey } from '../types';

vi.mock('hooks/useCollateral');

const columns: ColumnKey[] = ['asset', 'supplyApy', 'borrowApy', 'collateral', 'userWalletBalance'];

describe('MarketTable - Feature flag enabled: E-mode', () => {
  it('renders correctly when user does not have any E-mode group enabled', () => {
    const { container } = renderComponent(
      <MarketTable
        assets={poolData[0].assets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('renders correctly when user has an E-mode group enabled', () => {
    const fakeAssets: Asset[] = poolData[0].assets.map(asset => ({
      ...asset,
      userEModeGroupName: poolData[0].eModeGroups[0].name,
    }));

    const { container } = renderComponent(
      <MarketTable
        assets={fakeAssets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(container.textContent).toMatchSnapshot();
  });

  it('shows E-mode assets only if controls are enabled and corresponding toggle is enabled', () => {
    const mockSetUserChainSettings = vi.fn();

    const fakeUserChainSettings: UserChainSettings = {
      ...defaultUserChainSettings,
      showUserEModeAssetsOnly: false,
    };

    (useUserChainSettings as Mock).mockReturnValue([
      fakeUserChainSettings,
      mockSetUserChainSettings,
    ]);

    const fakeAssets: Asset[] = poolData[0].assets.map(asset => ({
      ...asset,
      userEModeGroupName: poolData[0].eModeGroups[0].name,
    }));

    const { container } = renderComponent(
      <MarketTable
        assets={fakeAssets}
        poolName={poolData[0].name}
        poolComptrollerContractAddress={poolData[0].comptrollerAddress}
        columns={columns}
        marketType="supply"
      />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(screen.getByText(en.marketTable.userAssetsOnlyToggle.label)).toBeInTheDocument();

    expect(container.textContent).toMatchSnapshot();

    // Check switching off toggle calls callback correctly
    const [_1, _2, eModeAssetsOnlyToggle] = screen.getAllByRole('checkbox');

    fireEvent.click(eModeAssetsOnlyToggle);

    expect(mockSetUserChainSettings).toHaveBeenCalledTimes(1);
    expect(mockSetUserChainSettings).toHaveBeenCalledWith({
      showUserEModeAssetsOnly: !fakeUserChainSettings.showUserEModeAssetsOnly,
    });
  });
});

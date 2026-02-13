import { fireEvent, screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { en } from 'libs/translations';
import type { UserChainSettings } from 'store';
import { renderComponent } from 'testUtils/render';
import { Controls, type ControlsProps } from '..';

const mockSetUserChainSettings = vi.fn();

const baseProps: ControlsProps = {
  searchValue: '',
  onSearchValueChange: vi.fn(),
  searchInputPlaceholder: en.marketTable.search.placeholder,
  showPausedAssetsToggle: false,
};

(useUserChainSettings as Mock).mockReturnValue([
  defaultUserChainSettings,
  mockSetUserChainSettings,
]);

describe('Controls', () => {
  it('calls callback when search input value changes', () => {
    const mockOnSearchValueChange = vi.fn();

    renderComponent(<Controls {...baseProps} onSearchValueChange={mockOnSearchValueChange} />);

    const searchInput = screen.getByPlaceholderText(baseProps.searchInputPlaceholder);

    fireEvent.change(searchInput, { target: { value: 'usdt' } });

    expect(mockOnSearchValueChange).toHaveBeenCalledTimes(1);
    expect(mockOnSearchValueChange).toHaveBeenCalledWith('usdt');
  });

  it('hides toggles when wallet is disconnected and paused assets toggle is disabled', () => {
    renderComponent(<Controls {...baseProps} />);

    expect(screen.queryByText(en.controls.userAssetsOnlyToggle.label)).toBeNull();
    expect(screen.queryByText(en.controls.pausedAssetsToggle.label)).toBeNull();
  });

  it('lets user toggle user assets only when wallet is connected', () => {
    const fakeUserChainSettings: UserChainSettings = {
      ...defaultUserChainSettings,
      showUserAssetsOnly: true,
    };

    (useUserChainSettings as Mock).mockReturnValue([
      fakeUserChainSettings,
      mockSetUserChainSettings,
    ]);

    renderComponent(<Controls {...baseProps} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(screen.getByText(en.controls.userAssetsOnlyToggle.label)).toBeInTheDocument();

    const [toggle] = screen.getAllByRole('checkbox');
    fireEvent.click(toggle);

    expect(mockSetUserChainSettings).toHaveBeenCalledTimes(1);
    expect(mockSetUserChainSettings).toHaveBeenCalledWith({ showUserAssetsOnly: false });
  });

  it('lets user toggle paused assets when paused assets toggle is enabled', () => {
    const fakeUserChainSettings: UserChainSettings = {
      ...defaultUserChainSettings,
      showPausedAssets: false,
    };

    (useUserChainSettings as Mock).mockReturnValue([
      fakeUserChainSettings,
      mockSetUserChainSettings,
    ]);

    renderComponent(<Controls {...baseProps} showPausedAssetsToggle />);

    expect(screen.getByText(en.controls.pausedAssetsToggle.label)).toBeInTheDocument();

    const [toggle] = screen.getAllByRole('checkbox');
    fireEvent.click(toggle);

    expect(mockSetUserChainSettings).toHaveBeenCalledTimes(1);
    expect(mockSetUserChainSettings).toHaveBeenCalledWith({ showPausedAssets: true });
  });
});

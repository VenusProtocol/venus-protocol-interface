import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { Mock } from 'vitest';

import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useIsConnectedAccountVip } from 'hooks/useIsConnectedAccountVip';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSwitchInterfaceMode } from 'hooks/useSwitchInterfaceMode';
import { defaultUserChainSettings, useUserChainSettings } from 'hooks/useUserChainSettings';
import { useAccountAddress } from 'libs/wallet';

import { InterfaceOnboarding } from '..';
import { ONBOARDING_SEEN_STORAGE_KEY } from '../storage';

vi.mock('hooks/useInterfaceMode');
vi.mock('hooks/useIsConnectedAccountVip');
vi.mock('hooks/useSwitchInterfaceMode');

const switchInterfaceModeMock = vi.fn();

const renderOnboarding = ({ pathname }: { pathname: string }) =>
  renderComponent(
    <>
      <button type="button" data-interface-mode-switch="">
        Mode
      </button>
      <InterfaceOnboarding />
    </>,
    { routerInitialEntries: [pathname], routePath: '*' },
  );

const setUp = ({ isLite }: { isLite: boolean }) => {
  (useIsFeatureEnabled as Mock).mockImplementation(({ name }) => name === 'liteMode');
  (useInterfaceMode as Mock).mockImplementation(() => ({
    mode: isLite ? 'lite' : 'pro',
    isLite,
    setMode: vi.fn(),
  }));
  (useSwitchInterfaceMode as Mock).mockImplementation(() => switchInterfaceModeMock);
  (useIsConnectedAccountVip as Mock).mockImplementation(() => ({
    isConnectedAccountVip: false,
    isLoading: false,
  }));
};

describe('InterfaceOnboarding', () => {
  beforeEach(() => {
    window.localStorage.clear();
    switchInterfaceModeMock.mockClear();
    (useAccountAddress as Mock).mockImplementation(() => ({ accountAddress: undefined }));
    (useUserChainSettings as Mock).mockImplementation(() => [defaultUserChainSettings, vi.fn()]);
  });

  it('introduces Pro when the first page is the Lite home page', async () => {
    setUp({ isLite: true });
    renderOnboarding({ pathname: '/' });

    await waitFor(() =>
      expect(screen.getByText(en.layout.interfaceOnboarding.pro.title)).toBeInTheDocument(),
    );
    expect(window.localStorage.getItem(ONBOARDING_SEEN_STORAGE_KEY)).toBeNull();

    fireEvent.click(screen.getByText(en.layout.interfaceOnboarding.pro.tryButtonLabel));

    expect(switchInterfaceModeMock).toHaveBeenCalledWith('pro');
    expect(window.localStorage.getItem(ONBOARDING_SEEN_STORAGE_KEY)).toBe('true');
    expect(screen.queryByText(en.layout.interfaceOnboarding.pro.title)).not.toBeInTheDocument();
  });

  it('introduces Lite when the first page is a Pro page', async () => {
    setUp({ isLite: false });
    renderOnboarding({ pathname: '/liquidity-hubs' });

    await waitFor(() =>
      expect(screen.getByText(en.layout.interfaceOnboarding.lite.title)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByText(en.layout.interfaceOnboarding.lite.tryButtonLabel));

    expect(switchInterfaceModeMock).toHaveBeenCalledWith('lite');
  });

  it('closes without switching the interface mode', async () => {
    setUp({ isLite: true });
    renderOnboarding({ pathname: '/' });

    await waitFor(() =>
      expect(screen.getByText(en.layout.interfaceOnboarding.pro.title)).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByLabelText(en.layout.interfaceOnboarding.closeButtonLabel));

    expect(screen.queryByText(en.layout.interfaceOnboarding.pro.title)).not.toBeInTheDocument();
    expect(switchInterfaceModeMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(ONBOARDING_SEEN_STORAGE_KEY)).toBe('true');
  });

  it('waits for the VIP modal to be closed before showing', async () => {
    setUp({ isLite: true });
    (useAccountAddress as Mock).mockImplementation(() => ({
      accountAddress: '0x0000000000000000000000000000000000000001',
    }));
    (useIsConnectedAccountVip as Mock).mockImplementation(() => ({
      isConnectedAccountVip: true,
      isLoading: false,
    }));

    const { rerender } = renderOnboarding({ pathname: '/' });

    await new Promise(resolve => setTimeout(resolve, 1200));
    expect(screen.queryByText(en.layout.interfaceOnboarding.pro.title)).not.toBeInTheDocument();

    (useUserChainSettings as Mock).mockImplementation(() => [
      { ...defaultUserChainSettings, doNotShowVipModal: true },
      vi.fn(),
    ]);
    rerender(
      <>
        <button type="button" data-interface-mode-switch="">
          Mode
        </button>
        <InterfaceOnboarding />
      </>,
    );

    await waitFor(() =>
      expect(screen.getByText(en.layout.interfaceOnboarding.pro.title)).toBeInTheDocument(),
    );
  });

  it('waits until the VIP status of the connected account is known', async () => {
    setUp({ isLite: true });
    (useAccountAddress as Mock).mockImplementation(() => ({
      accountAddress: '0x0000000000000000000000000000000000000001',
    }));
    (useIsConnectedAccountVip as Mock).mockImplementation(() => ({
      isConnectedAccountVip: false,
      isLoading: true,
    }));

    renderOnboarding({ pathname: '/' });

    await new Promise(resolve => setTimeout(resolve, 1200));
    expect(screen.queryByText(en.layout.interfaceOnboarding.pro.title)).not.toBeInTheDocument();
  });

  it('does not show again once an introduction has been seen', async () => {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true');
    setUp({ isLite: false });
    renderOnboarding({ pathname: '/liquidity-hubs' });

    await new Promise(resolve => setTimeout(resolve, 1200));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('waits until no other dialog is open', async () => {
    setUp({ isLite: true });
    const { container } = renderOnboarding({ pathname: '/' });

    const otherDialog = document.createElement('div');
    otherDialog.setAttribute('role', 'dialog');
    container.appendChild(otherDialog);

    await new Promise(resolve => setTimeout(resolve, 1200));
    expect(screen.queryByText(en.layout.interfaceOnboarding.pro.title)).not.toBeInTheDocument();

    otherDialog.remove();

    await waitFor(() =>
      expect(screen.getByText(en.layout.interfaceOnboarding.pro.title)).toBeInTheDocument(),
    );
  });
});

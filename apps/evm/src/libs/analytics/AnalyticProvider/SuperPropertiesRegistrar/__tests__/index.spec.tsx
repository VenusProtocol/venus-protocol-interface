import type { Mock } from 'vitest';

import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useTheme } from 'hooks/useTheme';
import { useAccountAddress } from 'libs/wallet';
import { usePostHog } from 'posthog-js/react';
import { renderComponent } from 'testUtils/render';

import { SuperPropertiesRegistrar } from '..';

vi.mock('hooks/useInterfaceMode');
vi.mock('hooks/useTheme');
vi.mock('posthog-js/react', () => ({
  usePostHog: vi.fn(),
}));

const registerMock = vi.fn();

describe('SuperPropertiesRegistrar', () => {
  beforeEach(() => {
    registerMock.mockClear();

    (usePostHog as Mock).mockReturnValue({ register: registerMock });
    (useInterfaceMode as Mock).mockReturnValue({ mode: 'lite' });
    (useTheme as Mock).mockReturnValue({ preference: 'system' });
    (useAccountAddress as Mock).mockReturnValue({
      accountAddress: '0x1111111111111111111111111111111111111111',
    });
  });

  it('registers the interface version and theme preference', () => {
    renderComponent(<SuperPropertiesRegistrar />);

    expect(registerMock).toHaveBeenCalledWith({ version: 'lite', themePreference: 'system' });
  });

  it('registers them again when they change', () => {
    const { rerender } = renderComponent(<SuperPropertiesRegistrar />);

    (useInterfaceMode as Mock).mockReturnValue({ mode: 'pro' });
    (useTheme as Mock).mockReturnValue({ preference: 'light' });
    rerender(<SuperPropertiesRegistrar />);

    expect(registerMock).toHaveBeenLastCalledWith({ version: 'pro', themePreference: 'light' });
  });

  it('registers them again after the wallet disconnects', () => {
    const { rerender } = renderComponent(<SuperPropertiesRegistrar />);

    registerMock.mockClear();
    (useAccountAddress as Mock).mockReturnValue({ accountAddress: undefined });
    rerender(<SuperPropertiesRegistrar />);

    expect(registerMock).toHaveBeenCalledWith({ version: 'lite', themePreference: 'system' });
  });
});

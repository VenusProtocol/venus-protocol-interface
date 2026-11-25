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
    (useTheme as Mock).mockReturnValue({ preference: 'system', theme: 'light' });
    (useAccountAddress as Mock).mockReturnValue({
      accountAddress: '0x1111111111111111111111111111111111111111',
    });
  });

  it('registers the interface version, theme preference and resolved theme', () => {
    renderComponent(<SuperPropertiesRegistrar />);

    expect(registerMock).toHaveBeenCalledWith({
      version: 'lite',
      themePreference: 'system',
      theme: 'light',
    });
  });

  it('registers them again when they change', () => {
    const { rerender } = renderComponent(<SuperPropertiesRegistrar />);

    (useInterfaceMode as Mock).mockReturnValue({ mode: 'pro' });
    (useTheme as Mock).mockReturnValue({ preference: 'dark', theme: 'dark' });
    rerender(<SuperPropertiesRegistrar />);

    expect(registerMock).toHaveBeenLastCalledWith({
      version: 'pro',
      themePreference: 'dark',
      theme: 'dark',
    });
  });

  it('registers the resolved theme again when the system theme changes', () => {
    const { rerender } = renderComponent(<SuperPropertiesRegistrar />);

    (useTheme as Mock).mockReturnValue({ preference: 'system', theme: 'dark' });
    rerender(<SuperPropertiesRegistrar />);

    expect(registerMock).toHaveBeenLastCalledWith({
      version: 'lite',
      themePreference: 'system',
      theme: 'dark',
    });
  });

  it('registers them again after the wallet disconnects', () => {
    const { rerender } = renderComponent(<SuperPropertiesRegistrar />);

    registerMock.mockClear();
    (useAccountAddress as Mock).mockReturnValue({ accountAddress: undefined });
    rerender(<SuperPropertiesRegistrar />);

    expect(registerMock).toHaveBeenCalledWith({
      version: 'lite',
      themePreference: 'system',
      theme: 'light',
    });
  });
});

import { act } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { governanceChainId, useSwitchChain } from 'libs/wallet';
import { renderHook } from 'testUtils/render';

import { useSwitchInterfaceMode } from '..';

vi.mock('hooks/useInterfaceMode');

const setModeMock = vi.fn();
const switchChainMock = vi.fn();

describe('useSwitchInterfaceMode', () => {
  beforeEach(() => {
    setModeMock.mockClear();
    switchChainMock.mockClear();

    (useInterfaceMode as Mock).mockImplementation(() => ({
      mode: 'pro',
      isLite: false,
      setMode: setModeMock,
    }));
    (useSwitchChain as Mock).mockImplementation(() => ({ switchChain: switchChainMock }));
  });

  it('switches mode on the current chain when Lite is supported', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(({ name }) => name === 'liteMode');

    const { result } = renderHook(() => useSwitchInterfaceMode());

    act(() => result.current('lite'));

    expect(switchChainMock).not.toHaveBeenCalled();
    expect(setModeMock).toHaveBeenCalledWith('lite');
  });

  it('switches to the BNB chain before entering Lite when the current chain does not support it', () => {
    (useIsFeatureEnabled as Mock).mockImplementation(() => false);

    const { result } = renderHook(() => useSwitchInterfaceMode());

    act(() => result.current('lite'));

    expect(setModeMock).not.toHaveBeenCalled();
    expect(switchChainMock).toHaveBeenCalledWith(
      expect.objectContaining({ chainId: governanceChainId }),
    );

    act(() => switchChainMock.mock.calls[0][0].callback());

    expect(setModeMock).toHaveBeenCalledWith('lite');
  });
});

import type Vi from 'vitest';

import { useChainId } from 'libs/wallet';
import { store } from 'store';
import { renderHook as renderHookWithContext } from 'testUtils/render';
import { ChainId } from 'types';
import { useUserChainSettings } from '..';

vi.mock('store', () => ({
  store: {
    use: {
      setUserSettings: vi.fn(() => vi.fn()),
      userSettings: vi.fn(() => ({
        gaslessTransactions: true,
      })),
    },
  },
}));

describe('useUserChainSettings', () => {
  beforeEach(() => {
    (useChainId as Vi.Mock).mockReturnValue({
      chainId: ChainId.BSC_TESTNET,
    });
  });

  it('returns correct settings from the store', () => {
    (store.use.userSettings as Vi.Mock).mockReturnValue({
      [ChainId.BSC_TESTNET]: {
        gaslessTransactions: false,
      },
    });

    const {
      result: {
        current: [userChainSettings],
      },
    } = renderHookWithContext(() => useUserChainSettings());

    expect(userChainSettings).toEqual({
      gaslessTransactions: false,
    });
  });

  it('calls setState when updating settings', () => {
    (store.use.setUserSettings as Vi.Mock).mockReturnValue(vi.fn(() => vi.fn()));

    const {
      result: {
        current: [_userChainSettings, setUserChainSettings],
      },
    } = renderHookWithContext(() => useUserChainSettings());

    setUserChainSettings({ gaslessTransactions: false });

    expect(store.use.setUserSettings()).toHaveBeenCalledWith({
      settings: {
        gaslessTransactions: false,
      },
      chainIds: [ChainId.BSC_TESTNET],
    });
  });
});

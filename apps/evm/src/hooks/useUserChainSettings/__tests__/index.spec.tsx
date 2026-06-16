import type { UserChainSettings } from 'store';
import { renderHook as renderHookWithContext } from 'testUtils/render';
import { ChainId } from 'types';
import { useUserChainSettings } from '..';

vi.unmock('hooks/useUserChainSettings');

const mockSetUserSettings = vi.fn();
const mockStoreState = {
  setUserSettings: mockSetUserSettings,
  userSettings: {} as Partial<Record<ChainId, Partial<UserChainSettings>>>,
};

vi.mock('store', () => ({
  useStore: vi.fn((selector: (state: typeof mockStoreState) => unknown) =>
    selector(mockStoreState),
  ),
}));

describe('useUserChainSettings', () => {
  it('returns correct settings from the store', () => {
    mockStoreState.userSettings = {
      [ChainId.BSC_TESTNET]: {
        gaslessTransactions: true,
      },
    };

    const {
      result: {
        current: [userChainSettings],
      },
    } = renderHookWithContext(() => useUserChainSettings());

    expect(userChainSettings).toMatchSnapshot();
  });

  it('calls setState when updating settings', () => {
    mockSetUserSettings.mockReset();

    const {
      result: {
        current: [_userChainSettings, setUserChainSettings],
      },
    } = renderHookWithContext(() => useUserChainSettings());

    setUserChainSettings({ gaslessTransactions: false });

    expect(mockSetUserSettings).toHaveBeenCalledWith({
      settings: {
        gaslessTransactions: false,
      },
      chainIds: [ChainId.BSC_TESTNET],
    });
  });
});

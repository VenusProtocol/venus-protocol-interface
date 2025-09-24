import { useChainId } from 'libs/wallet';
import { type State, type UserChainSettings, store } from 'store';

export const defaultUserChainSettings: UserChainSettings = {
  gaslessTransactions: false,
  showPausedAssets: false,
  showUserAssetsOnly: false,
  showUserEModeAssetsOnly: false,
  doNotShowImportPositionsModal: false,
};

export const useUserChainSettings = () => {
  const { chainId } = useChainId();

  const userSettings = store.use.userSettings();
  const userChainSettings = {
    ...defaultUserChainSettings,
    ...userSettings[chainId],
  };

  const setUserSettings = store.use.setUserSettings();

  const setUserChainSettings = (input: Parameters<State['setUserSettings']>[0]['settings']) =>
    setUserSettings({
      settings: input,
      chainIds: [chainId],
    });

  return [userChainSettings, setUserChainSettings] as const;
};

import { useChainId } from 'libs/wallet';
import { type State, store } from 'store';

export const useUserChainSettings = () => {
  const { chainId } = useChainId();

  const userSettings = store.use.userSettings();
  const userChainSettings = userSettings[chainId];

  const setUserSettings = store.use.setUserSettings();

  const setUserChainSettings = (input: Parameters<State['setUserSettings']>[0]['settings']) =>
    setUserSettings({
      settings: {
        ...userChainSettings,
        ...input,
      },
      chainIds: [chainId],
    });

  return [userChainSettings, setUserChainSettings] as const;
};

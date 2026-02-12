import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useChainId } from 'libs/wallet';
import { type State, type UserChainSettings, store } from 'store';

export const defaultUserChainSettings: UserChainSettings = {
  gaslessTransactions: false,
  showPausedAssets: false,
  showUserAssetsOnly: false,
  showUserEModeAssetsOnly: false,
  doNotShowImportPositionsModal: false,
  doNotShowUserBalances: false,
  doNotExpandGuide: false,
  slippageTolerancePercentage: String(DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE),
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

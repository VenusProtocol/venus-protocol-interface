import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { type State, type UserChainSettings, useStore } from 'store';

export const defaultUserChainSettings: UserChainSettings = {
  gaslessTransactions: false,
  showPausedAssets: false,
  showUserAssetsOnly: false,
  doNotShowImportPositionsModal: false,
  slippageTolerancePercentage: String(DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE),
  doNotShowUserBalances: false,
  doNotExpandGuide: false,
  doNotShowFixedRateVaultsAdBanner: false,
  doNotShowGatedAssetModal: false,
};

export const useUserChainSettings = () => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  const userSettings = useStore(state => state.userSettings);
  const userChainSettings: UserChainSettings = {
    ...defaultUserChainSettings,
    ...userSettings[chainId],
    showUserAssetsOnly: !!accountAddress && !!userSettings[chainId]?.showUserAssetsOnly,
  };

  const setUserSettings = useStore(state => state.setUserSettings);

  const setUserChainSettings = (input: Parameters<State['setUserSettings']>[0]['settings']) =>
    setUserSettings({
      settings: input,
      chainIds: [chainId],
    });

  return [userChainSettings, setUserChainSettings] as const;
};

import { HIDDEN_BALANCE_KEY } from 'constants/placeholders';
import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useAccountAddress } from 'libs/wallet';

export interface HidableUserBalanceProps {
  children: React.ReactNode;
}

export const HidableUserBalance: React.FC<HidableUserBalanceProps> = ({ children }) => {
  const { accountAddress } = useAccountAddress();
  const [userChainSettings] = useUserChainSettings();
  const shouldHideUserBalances = !!accountAddress && userChainSettings.doNotShowUserBalances;

  return shouldHideUserBalances ? HIDDEN_BALANCE_KEY : children;
};

import { HIDDEN_BALANCE_KEY } from 'constants/placeholders';
import { useUserChainSettings } from 'hooks/useUserChainSettings';

export interface HidableUserBalanceProps {
  children: React.ReactNode;
}

export const HidableUserBalance: React.FC<HidableUserBalanceProps> = ({ children }) => {
  const [userChainSettings] = useUserChainSettings();
  const shouldHideUserBalances = userChainSettings.doNotShowUserBalances;

  return shouldHideUserBalances ? HIDDEN_BALANCE_KEY : children;
};

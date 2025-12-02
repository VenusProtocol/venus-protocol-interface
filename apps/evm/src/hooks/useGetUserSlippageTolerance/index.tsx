import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { useUserChainSettings } from 'hooks/useUserChainSettings';

export const useGetUserSlippageTolerance = () => {
  const [userChainSettings] = useUserChainSettings();

  const userSlippageTolerancePercentage = userChainSettings.slippageTolerancePercentage
    ? Number(userChainSettings.slippageTolerancePercentage)
    : DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE;

  return {
    userSlippageTolerancePercentage,
  };
};

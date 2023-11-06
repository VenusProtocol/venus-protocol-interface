import { ChainId } from 'types';

import { useAuth } from 'context/AuthContext';

const featureFlags = {
  integratedSwap: [ChainId.BSC_TESTNET, ChainId.BSC_MAINNET],
  prime: [ChainId.BSC_TESTNET],
  tusdMigrationWarning: [ChainId.BSC_MAINNET],
  trxMigrationWarning: [ChainId.BSC_MAINNET],
  sxpDisablingWarning: [ChainId.BSC_MAINNET],
  bethUpdateWarning: [ChainId.BSC_MAINNET],
};

export type FeatureFlag = keyof typeof featureFlags;

export interface UseIsFeatureEnabled {
  name: FeatureFlag;
}

export const useIsFeatureEnabled = ({ name }: UseIsFeatureEnabled) => {
  const { chainId } = useAuth();
  return featureFlags[name].includes(chainId);
};

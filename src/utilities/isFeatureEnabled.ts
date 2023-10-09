import { ENV_VARIABLES } from 'config';

export type FeatureFlag = keyof typeof featureFlags;

const featureFlags = {
  integratedSwap: ENV_VARIABLES.VITE_FF_INTEGRATED_SWAP === 'true',
  prime: ENV_VARIABLES.VITE_FF_PRIME === 'true',
};

const isFeatureEnabled = (featureFlag: FeatureFlag) => featureFlags[featureFlag];

export default isFeatureEnabled;

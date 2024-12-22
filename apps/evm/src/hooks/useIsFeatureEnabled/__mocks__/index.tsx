import { featureFlags as originalFeatureFlags } from '..';

// Disable all feature flags
export const featureFlags = Object.keys(originalFeatureFlags).reduce(
  (acc, key) => ({
    ...acc,
    [key]: [],
  }),
  {},
);

export const useIsFeatureEnabled = vi.fn(() => false);

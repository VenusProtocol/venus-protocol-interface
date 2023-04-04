import config from 'config';

const isFeatureEnabled = (featureFlag: keyof typeof config.featureFlags) =>
  config.featureFlags[featureFlag];

export default isFeatureEnabled;

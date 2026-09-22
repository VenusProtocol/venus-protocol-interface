export const LOAN_ASSET_PARAM_KEY = 'loanAsset';
export const COLLATERAL_PARAM_KEY = 'collateral';
export const POOL_PARAM_KEY = 'pool';

// Every group the user can filter on, so clearing all of them stays in one place
export const FILTER_PARAM_KEYS = [
  LOAN_ASSET_PARAM_KEY,
  COLLATERAL_PARAM_KEY,
  POOL_PARAM_KEY,
] as const;

export const PARAM_VALUE_SEPARATOR = ',';

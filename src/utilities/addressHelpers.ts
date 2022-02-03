import addresses from '../config/contracts';

const chainId = process.env.REACT_APP_CHAIN_ID;

export const getVaiTokenAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.vaiToken[chainId];
};

export const getVaiVaultAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.vaiVault[chainId];
};

export const getVaiUnitrollerAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.vaiUnitroller[chainId];
};

export const getComptrollerAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.comptroller[chainId];
};

export const getOracleAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.oracle[chainId];
};

export const getVenusLensAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.venusLens[chainId];
};

export const getXvsVaultAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.xvsVault[chainId];
};

export const getXvsVaultProxyAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.xvsVaultProxy[chainId];
};

export const getXvsVaultStoreAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.xvsVaultStore[chainId];
};

export const getGovernorBravoAddress = () => {
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  return addresses.governorBravoDelegator[chainId];
};

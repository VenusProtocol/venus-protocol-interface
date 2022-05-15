import addresses from '../config/contracts';

const chainId = process.env.REACT_APP_CHAIN_ID;

export const getVaiTokenAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.vaiToken[chainId];
export const getVaiVaultAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.vaiVault[chainId];
export const getVaiUnitrollerAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.vaiUnitroller[chainId];
export const getComptrollerAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.comptroller[chainId];
export const getComptrollerLensAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.comptrollerLens[chainId];
export const getOracleAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.oracle[chainId];
export const getVenusLensAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.venusLens[chainId];
export const getXvsVaultAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.xvsVault[chainId];
export const getXvsVaultProxyAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.xvsVaultProxy[chainId];
export const getXvsVaultStoreAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.xvsVaultStore[chainId];
export const getGovernorBravoAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.governorBravoDelegator[chainId];
export const getVrtTokenAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.vrtToken[chainId];
export const getXvsVestingProxyAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.xvsVestingProxy[chainId];
export const getVrtConverterProxyAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.vrtConverterProxy[chainId];
export const getVrtVaultProxyAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.vrtVaultProxy[chainId];

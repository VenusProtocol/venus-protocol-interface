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
export const getXvsVestingAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.xvsVesting[chainId];
export const getVrtConverterAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.vrtConverter[chainId];
export const getVrtTokenAddress = () =>
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  addresses.vrtToken[chainId];

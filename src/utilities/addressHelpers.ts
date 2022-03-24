import { CHAIN_ID } from 'config';
import addresses from '../config/contracts';

export const getVaiTokenAddress = () => addresses.vaiToken[CHAIN_ID];
export const getVaiVaultAddress = () => addresses.vaiVault[CHAIN_ID];
export const getVaiUnitrollerAddress = () => addresses.vaiUnitroller[CHAIN_ID];
export const getComptrollerAddress = () => addresses.comptroller[CHAIN_ID];
export const getOracleAddress = () => addresses.oracle[CHAIN_ID];
export const getVenusLensAddress = () => addresses.venusLens[CHAIN_ID];
export const getXvsVaultAddress = () => addresses.xvsVault[CHAIN_ID];
export const getXvsVaultProxyAddress = () => addresses.xvsVaultProxy[CHAIN_ID];
export const getXvsVaultStoreAddress = () => addresses.xvsVaultStore[CHAIN_ID];
export const getGovernorBravoAddress = () => addresses.governorBravoDelegator[CHAIN_ID];
export const getVrtTokenAddress = () => addresses.vrtToken[CHAIN_ID];
export const getXvsVestingProxyAddress = () => addresses.xvsVestingProxy[CHAIN_ID];
export const getVrtConverterProxyAddress = () => addresses.vrtConverterProxy[CHAIN_ID];
export const getVrtVaultProxyAddress = () => addresses.vrtVaultProxy[CHAIN_ID];

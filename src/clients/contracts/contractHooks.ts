import { useMemo } from 'react';

import { useWeb3 } from 'clients/web3';
import {
  getComptrollerContract,
  getInterestModelContract,
  getPriceOracleContract,
  getTokenContract,
  getVaiTokenContract,
  getVaiUnitrollerContract,
  getVaiVaultContract,
  getVbepContract,
  getVenusLensContract,
  getXvsVaultProxyContract,
  getXvsVaultContract,
  getTokenContractByAddress,
  getGovernorBravoContract,
  getVrtConverterProxyContract,
  getXvsVestingProxyContract,
  getVrtTokenContract,
  getVrtVaultProxyContract,
} from './contractHelpers';

export const useToken = (name: $TSFixMe) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContract(web3, name), [web3, name]);
};

export const useTokenByAddress = (address: $TSFixMe) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContractByAddress(web3, address), [web3, address]);
};

export const useVaiToken = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaiTokenContract(web3), [web3]);
};

export const useVaiUnitroller = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaiUnitrollerContract(web3), [web3]);
};

export const useVaiVault = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaiVaultContract(web3), [web3]);
};

export const useVbep = (name: $TSFixMe) => {
  const web3 = useWeb3();
  return useMemo(() => getVbepContract(web3, name), [web3, name]);
};

export const useComptroller = () => {
  const web3 = useWeb3();
  return useMemo(() => getComptrollerContract(web3), [web3]);
};

export const usePriceOracle = () => {
  const web3 = useWeb3();
  return useMemo(() => getPriceOracleContract(web3), [web3]);
};

export const useInterestModel = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getInterestModelContract(web3, address), [web3]);
};

export const useVenusLens = () => {
  const web3 = useWeb3();
  return useMemo(() => getVenusLensContract(web3), [web3]);
};

export const useXvsVault = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVaultContract(web3), [web3]);
};

export const useXvsVaultProxy = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVaultProxyContract(web3), [web3]);
};

export const useGovernorBravo = () => {
  const web3 = useWeb3();
  return useMemo(() => getGovernorBravoContract(web3), [web3]);
};

// VRT conversion
export const useVrtConverterProxy = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtConverterProxyContract(web3), [web3]);
};

export const useXvsVestingProxy = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVestingProxyContract(web3), [web3]);
};

export const useVrtToken = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtTokenContract(web3), [web3]);
};

export const useVrtVaultProxy = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtVaultProxyContract(web3), [web3]);
};

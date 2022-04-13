import { useMemo } from 'react';

import { useWeb3 } from 'clients/web3';
import {
  getComptrollerContract,
  getInterestModelContract,
  getPriceOracleContract,
  getTokenContract,
  getVaiUnitrollerContract,
  getVaiVaultContract,
  getVBepTokenContract,
  getVenusLensContract,
  getXvsVaultProxyContract,
  getXvsVaultContract,
  getTokenContractByAddress,
  getGovernorBravoContract,
  getVrtConverterProxyContract,
  getXvsVestingProxyContract,
  getVrtVaultProxyContract,
} from './getters';

export const useTokenContract = (name: $TSFixMe) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContract(web3, name), [web3, name]);
};

export const useTokenContractByAddress = (address: $TSFixMe) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContractByAddress(web3, address), [web3, address]);
};

export const useVBepTokenContract = (name: $TSFixMe) => {
  const web3 = useWeb3();
  return useMemo(() => getVBepTokenContract(web3, name), [web3, name]);
};

export const useVaiUnitrollerContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaiUnitrollerContract(web3), [web3]);
};

export const useVaiVaultContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaiVaultContract(web3), [web3]);
};

export const useComptrollerContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getComptrollerContract(web3), [web3]);
};

export const usePriceOracleContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getPriceOracleContract(web3), [web3]);
};

export const useInterestModelContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getInterestModelContract(web3, address), [web3]);
};

export const useVenusLensContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVenusLensContract(web3), [web3]);
};

export const useXvsVaultContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVaultContract(web3), [web3]);
};

export const useXvsVaultProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVaultProxyContract(web3), [web3]);
};

export const useGovernorBravoContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getGovernorBravoContract(web3), [web3]);
};

// VRT conversion
export const useVrtConverterProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtConverterProxyContract(web3), [web3]);
};

export const useXvsVestingProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getXvsVestingProxyContract(web3), [web3]);
};

export const useVrtVaultProxyContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVrtVaultProxyContract(web3), [web3]);
};

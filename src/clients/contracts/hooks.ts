import { useMemo } from 'react';
import { Token, VToken } from 'types';

import { useWeb3 } from 'clients/web3';

import {
  getComptrollerContract,
  getGovernorBravoDelegateContract,
  getInterestModelContract,
  getPancakeRouterContract,
  getPriceOracleContract,
  getTokenContract,
  getTokenContractByAddress,
  getVTokenContract,
  getVaiControllerContract,
  getVaiVaultContract,
  getVenusLensContract,
  getVrtConverterProxyContract,
  getVrtVaultProxyContract,
  getXvsVaultContract,
  getXvsVaultProxyContract,
  getXvsVestingProxyContract,
} from './getters';

export const useTokenContract = (token: Token) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContract(token, web3), [web3, token]);
};

export const useTokenContractByAddress = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContractByAddress(address, web3), [web3, address]);
};

export const useVTokenContract = (vToken: VToken) => {
  const web3 = useWeb3();
  return useMemo(() => getVTokenContract(vToken, web3), [web3, vToken]);
};

export const useVaiControllerContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaiControllerContract(web3), [web3]);
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
  return useMemo(() => getInterestModelContract(address, web3), [web3]);
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

export const useGovernorBravoDelegateContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getGovernorBravoDelegateContract(web3), [web3]);
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

export const usePancakeRouterContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getPancakeRouterContract(web3), [web3]);
};

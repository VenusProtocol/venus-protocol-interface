import { useMemo } from 'react';
import { Token, VToken } from 'types';

import { useAuth } from 'clients/web3';

import {
  getComptrollerContract,
  getGovernorBravoDelegateContract,
  getPancakeRouterContract,
  getTokenContract,
  getVTokenContract,
  getVaiUnitrollerContract,
  getVaiVaultContract,
  getVenusLensContract,
  getVrtConverterProxyContract,
  getVrtVaultProxyContract,
  getXvsVaultContract,
  getXvsVaultProxyContract,
  getXvsVestingProxyContract,
} from './getters';

export const useTokenContract = (token: Token) => {
  const { signer } = useAuth();
  return useMemo(() => getTokenContract(token, signer || undefined), [signer, token]);
};

export const useVTokenContract = (vToken: VToken) => {
  const { signer } = useAuth();
  return useMemo(() => getVTokenContract(vToken, signer || undefined), [signer, vToken]);
};

export const useVaiUnitrollerContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVaiUnitrollerContract(signer || undefined), [signer]);
};

export const useVaiVaultContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVaiVaultContract(signer || undefined), [signer]);
};

export const useComptrollerContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getComptrollerContract(signer || undefined), [signer]);
};

export const useVenusLensContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVenusLensContract(signer || undefined), [signer]);
};

export const useXvsVaultContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getXvsVaultContract(signer || undefined), [signer]);
};

export const useXvsVaultProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getXvsVaultProxyContract(signer || undefined), [signer]);
};

export const useGovernorBravoDelegateContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getGovernorBravoDelegateContract(signer || undefined), [signer]);
};

// VRT conversion
export const useVrtConverterProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVrtConverterProxyContract(signer || undefined), [signer]);
};

export const useXvsVestingProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getXvsVestingProxyContract(signer || undefined), [signer]);
};

export const useVrtVaultProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVrtVaultProxyContract(signer || undefined), [signer]);
};

export const usePancakeRouterContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getPancakeRouterContract(signer || undefined), [signer]);
};

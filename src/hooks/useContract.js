import { useMemo } from 'react';
import {
  getComptrollerContract,
  getInterestModelContract,
  getPriceOracleContract,
  getTokenContract,
  getVaiTokenContract,
  getVaiUnitrollerContract,
  getVaiVaultContract,
  getVaultContract,
  getVbepContract,
  getVoteContract,
  getVenusLensContract
} from '../utilities/contractHelpers';
import useWeb3 from './useWeb3';

export const useToken = name => {
  const web3 = useWeb3();
  return useMemo(() => getTokenContract(web3, name), [web3, name]);
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

export const useVault = () => {
  const web3 = useWeb3();
  return useMemo(() => getVaultContract(web3), [web3]);
};

export const useVbep = name => {
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

export const useVote = () => {
  const web3 = useWeb3();
  return useMemo(() => getVoteContract(web3), [web3]);
};

export const useInterestModel = address => {
  const web3 = useWeb3();
  return useMemo(() => getInterestModelContract(web3), [web3]);
};

export const useVenusLens = () => {
  const web3 = useWeb3();
  return useMemo(() => getVenusLensContract(web3), [web3]);
};

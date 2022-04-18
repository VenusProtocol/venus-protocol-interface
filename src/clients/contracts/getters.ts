import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { TokenId, VTokenId } from 'types';
import { getWeb3NoAccount } from 'clients/web3';
import bep20Abi from 'constants/contracts/abis/bep20.json';
import comptrollerAbi from 'constants/contracts/abis/comptroller.json';
import interestModelAbi from 'constants/contracts/abis/interestModel.json';
import oracleAbi from 'constants/contracts/abis/oracle.json';
import vaiTokenAbi from 'constants/contracts/abis/vaiToken.json';
import vaiUnitrollerAbi from 'constants/contracts/abis/vaiUnitroller.json';
import vaiVaultAbi from 'constants/contracts/abis/vaiVault.json';
import xvsVaultStoreAbi from 'constants/contracts/abis/xvsVaultStore.json';
import xvsVaultAbi from 'constants/contracts/abis/xvsVault.json';
import vBep20Abi from 'constants/contracts/abis/vBep20.json';
import vBnbTokenAbi from 'constants/contracts/abis/vBnbToken.json';
import xvsTokenAbi from 'constants/contracts/abis/xvsToken.json';
import venusLensAbi from 'constants/contracts/abis/venusLens.json';
import governorBravoDelegateAbi from 'constants/contracts/abis/governorBravoDelegate.json';
import xvsVestingAbi from 'constants/contracts/abis/xvsVesting.json';
import vrtConverterAbi from 'constants/contracts/abis/vrtConverter.json';
import vrtTokenAbi from 'constants/contracts/abis/vrtToken.json';
import vrtVaultAbi from 'constants/contracts/abis/vrtVault.json';
import {
  Bep20,
  Comptroller,
  InterestModel,
  Oracle,
  VaiVault,
  VaiUnitroller,
  XvsVault,
  XvsVaultStore,
  VenusLens,
  GovernorBravoDelegate,
  XvsVesting,
  VrtVault,
  VrtConverter,
} from 'types/contracts';
import { getContractAddress, getToken, getVBepToken } from 'utilities';
import { TokenContract, VTokenContract } from './types';

const getContract = <T>(abi: AbiItem | AbiItem[], address: string, web3Instance: Web3) => {
  const web3 = web3Instance ?? getWeb3NoAccount();
  return new web3.eth.Contract(abi, address) as unknown as T;
};

export const getTokenContract = <T extends TokenId>(tokenId: T, web3: Web3): TokenContract<T> => {
  const tokenAddress = getToken(tokenId).address;

  if (tokenId === 'xvs') {
    return getContract<TokenContract<T>>(xvsTokenAbi as AbiItem[], tokenAddress, web3);
  }

  if (tokenId === 'vai') {
    return getContract<TokenContract<T>>(vaiTokenAbi as AbiItem[], tokenAddress, web3);
  }

  if (tokenId === 'vrt') {
    return getContract<TokenContract<T>>(vrtTokenAbi as AbiItem[], tokenAddress, web3);
  }

  return getContract<TokenContract<T>>(bep20Abi as AbiItem[], tokenAddress, web3);
};

export const getTokenContractByAddress = (address: string, web3: Web3): Bep20 =>
  getContract(bep20Abi as AbiItem[], address, web3) as unknown as Bep20;

export const getVTokenContract = <T extends VTokenId>(
  tokenId: T,
  web3: Web3,
): VTokenContract<T> => {
  const vBepTokenAddress = getVBepToken(tokenId).address;

  if (tokenId === 'bnb') {
    return getContract(
      vBnbTokenAbi as AbiItem[],
      vBepTokenAddress,
      web3,
    ) as unknown as VTokenContract<T>;
  }

  return getContract(
    vBep20Abi as AbiItem[],
    vBepTokenAddress,
    web3,
  ) as unknown as VTokenContract<T>;
};

export const getVaiUnitrollerContract = (web3: Web3) =>
  getContract(
    vaiUnitrollerAbi as AbiItem[],
    getContractAddress('vaiUnitroller'),
    web3,
  ) as unknown as VaiUnitroller;

export const getVaiVaultContract = (web3: Web3) =>
  getContract(
    vaiVaultAbi as AbiItem[],
    getContractAddress('vaiVault'),
    web3,
  ) as unknown as VaiVault;

export const getXvsVaultContract = (web3: Web3) =>
  getContract(
    xvsVaultAbi as AbiItem[],
    getContractAddress('xvsVault'),
    web3,
  ) as unknown as XvsVault;

export const getXvsVaultProxyContract = (web3: Web3) =>
  getContract(
    xvsVaultAbi as AbiItem[],
    getContractAddress('xvsVaultProxy'),
    web3,
  ) as unknown as XvsVault;

export const getXvsVaultStoreContract = (web3: Web3) =>
  getContract(
    xvsVaultStoreAbi as AbiItem[],
    getContractAddress('xvsVaultStore'),
    web3,
  ) as unknown as XvsVaultStore;

export const getComptrollerContract = (web3: Web3) =>
  getContract(
    comptrollerAbi as AbiItem[],
    getContractAddress('comptroller'),
    web3,
  ) as unknown as Comptroller;

export const getPriceOracleContract = (web3: Web3) =>
  getContract(oracleAbi as AbiItem[], getContractAddress('oracle'), web3) as unknown as Oracle;

export const getInterestModelContract = (address: string, web3: Web3) =>
  getContract(interestModelAbi as AbiItem[], address, web3) as unknown as InterestModel;

export const getVenusLensContract = (web3: Web3) =>
  getContract(
    venusLensAbi as AbiItem[],
    getContractAddress('venusLens'),
    web3,
  ) as unknown as VenusLens;

export const getGovernorBravoDelegateContract = (web3: Web3) =>
  getContract(
    governorBravoDelegateAbi as AbiItem[],
    getContractAddress('governorBravoDelegator'),
    web3,
  ) as unknown as GovernorBravoDelegate;

// VRT conversion
export const getXvsVestingProxyContract = (web3: Web3) =>
  getContract(
    xvsVestingAbi as AbiItem[],
    getContractAddress('xvsVestingProxy'),
    web3,
  ) as unknown as XvsVesting;

export const getVrtConverterProxyContract = (web3: Web3) =>
  getContract(
    vrtConverterAbi as AbiItem[],
    getContractAddress('vrtConverterProxy'),
    web3,
  ) as unknown as VrtConverter;

// VRT vault
export const getVrtVaultProxyContract = (web3: Web3) =>
  getContract(
    vrtVaultAbi as AbiItem[],
    getContractAddress('vrtVaultProxy'),
    web3,
  ) as unknown as VrtVault;

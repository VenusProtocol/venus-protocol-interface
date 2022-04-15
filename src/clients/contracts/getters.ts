import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

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
import vBepAbi from 'constants/contracts/abis/vBep.json';
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
  // VaiToken,
  VaiUnitroller,
  VaiVault,
  XvsVaultStore,
  XvsVault,
  // VBep,
  // VBnbToken,
  // XvsToken,
  VenusLens,
  GovernorBravoDelegate,
  XvsVesting,
  VrtConverter,
  // VrtToken,
  VrtVault,
} from 'types/contracts';
import { getContractAddress, getToken, getVBepToken } from 'utilities';

const getContract = (abi: AbiItem | AbiItem[], address: string | undefined, web3Instance: Web3) => {
  const web3 = web3Instance ?? getWeb3NoAccount();
  return new web3.eth.Contract(abi, address);
};

// @TODO: type "name"
export const getTokenContract = (web3: Web3, name: $TSFixMe) => {
  let abi = bep20Abi as $TSFixMe;

  if (name === 'xvs') {
    abi = xvsTokenAbi;
  } else if (name === 'vai') {
    abi = vaiTokenAbi;
  } else if (name === 'vrt') {
    abi = vrtTokenAbi;
  }

  // @TODO: assign return type based on `name`
  return getContract(abi, getToken(name).address, web3);
};

export const getTokenContractByAddress = (web3: Web3, address: $TSFixMe): Bep20 =>
  getContract(bep20Abi as AbiItem[], address, web3) as unknown as Bep20;

// @TODO: assign return type based on `name`
export const getVBepTokenContract = (web3: Web3, name: $TSFixMe) =>
  getContract(
    name === 'bnb' ? (vBnbTokenAbi as AbiItem[]) : (vBepAbi as AbiItem[]),
    getVBepToken(name).address,
    web3,
  );

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

export const getInterestModelContract = (web3: Web3, address: $TSFixMe) =>
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

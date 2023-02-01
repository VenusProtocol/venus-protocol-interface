import { Token } from 'types';
import { getContractAddress, unsafelyGetVToken } from 'utilities';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import { getWeb3NoAccount } from 'clients/web3';
import bep20Abi from 'constants/contracts/abis/bep20.json';
import comptrollerAbi from 'constants/contracts/abis/comptroller.json';
import governorBravoDelegateAbi from 'constants/contracts/abis/governorBravoDelegate.json';
import interestModelAbi from 'constants/contracts/abis/interestModel.json';
import maximillionAbi from 'constants/contracts/abis/maximillion.json';
import oracleAbi from 'constants/contracts/abis/oracle.json';
import pancakeRouterAbi from 'constants/contracts/abis/pancakeRouter.json';
import vBep20Abi from 'constants/contracts/abis/vBep20.json';
import vBnbTokenAbi from 'constants/contracts/abis/vBnbToken.json';
import vaiControllerAbi from 'constants/contracts/abis/vaiController.json';
import vaiTokenAbi from 'constants/contracts/abis/vaiToken.json';
import vaiVaultAbi from 'constants/contracts/abis/vaiVault.json';
import venusLensAbi from 'constants/contracts/abis/venusLens.json';
import vrtConverterAbi from 'constants/contracts/abis/vrtConverter.json';
import vrtTokenAbi from 'constants/contracts/abis/vrtToken.json';
import vrtVaultAbi from 'constants/contracts/abis/vrtVault.json';
import xvsTokenAbi from 'constants/contracts/abis/xvsToken.json';
import xvsVaultAbi from 'constants/contracts/abis/xvsVault.json';
import xvsVaultStoreAbi from 'constants/contracts/abis/xvsVaultStore.json';
import xvsVestingAbi from 'constants/contracts/abis/xvsVesting.json';
import { TOKENS } from 'constants/tokens';
import {
  Bep20,
  Comptroller,
  GovernorBravoDelegate,
  InterestModel,
  Maximillion,
  Oracle,
  PancakeRouter,
  VaiController,
  VaiVault,
  VenusLens,
  VrtConverter,
  VrtVault,
  XvsVault,
  XvsVaultStore,
  XvsVesting,
} from 'types/contracts';

import { TokenContract, VTokenContract } from './types';

const getContract = <T>(abi: AbiItem | AbiItem[], address: string, web3Instance: Web3) => {
  const web3 = web3Instance ?? getWeb3NoAccount();
  return new web3.eth.Contract(abi, address) as unknown as T;
};

export const getTokenContract = (token: Token, web3: Web3) => {
  if (token.address === TOKENS.xvs.address) {
    return getContract<TokenContract<'xvs'>>(xvsTokenAbi as AbiItem[], token.address, web3);
  }

  if (token.address === TOKENS.vai.address) {
    return getContract<TokenContract<'vai'>>(vaiTokenAbi as AbiItem[], token.address, web3);
  }

  if (token.address === TOKENS.vrt.address) {
    return getContract<TokenContract<'vrt'>>(vrtTokenAbi as AbiItem[], token.address, web3);
  }

  return getContract<TokenContract>(bep20Abi as AbiItem[], token.address, web3);
};

export const getTokenContractByAddress = (address: string, web3: Web3): Bep20 =>
  getContract(bep20Abi as AbiItem[], address, web3) as unknown as Bep20;

export const getVTokenContract = <T extends string>(tokenId: T, web3: Web3): VTokenContract<T> => {
  const vBepTokenAddress = unsafelyGetVToken(tokenId).address;

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

export const getVaiControllerContract = (web3: Web3) =>
  getContract(
    vaiControllerAbi as AbiItem[],
    getContractAddress('vaiController'),
    web3,
  ) as unknown as VaiController;

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

export const getMaximillionContract = (web3: Web3) =>
  getContract(
    maximillionAbi as AbiItem[],
    getContractAddress('maximillion'),
    web3,
  ) as unknown as Maximillion;

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

// PancakeSwap router
export const getPancakeRouterContract = (web3: Web3) =>
  getContract(
    pancakeRouterAbi as AbiItem[],
    getContractAddress('pancakeRouter'),
    web3,
  ) as unknown as PancakeRouter;

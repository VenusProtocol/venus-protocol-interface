import { getWeb3NoAccount } from './web3';
import bep20Abi from '../config/abis/bep20.json';
import comptrollerAbi from '../config/abis/comptroller.json';
import interestModelAbi from '../config/abis/interestModel.json';
import oracleAbi from '../config/abis/oracle.json';
import vaiTokenAbi from '../config/abis/vaiToken.json';
import vaiUnitrollerAbi from '../config/abis/vaiUnitroller.json';
import vaiVaultAbi from '../config/abis/vaiVault.json';
import xvsVaultStoreAbi from '../config/abis/xvsVaultStore.json';
import xvsVaultAbi from '../config/abis/xvsVault.json';
import vbepAbi from '../config/abis/vbep.json';
import vbnbAbi from '../config/abis/vbnb.json';
import xvsAbi from '../config/abis/xvs.json';
import venusLensAbi from '../config/abis/venusLens.json';
import governorBravoAbi from '../config/abis/governorBravoDelegate.json';
import {
  getComptrollerAddress,
  getOracleAddress,
  getVaiTokenAddress,
  getVaiUnitrollerAddress,
  getVaiVaultAddress,
  getXvsVaultAddress,
  getXvsVaultProxyAddress,
  getVenusLensAddress,
  getGovernorBravoAddress
} from './addressHelpers';
import * as constants from './constants';

const getContract = (abi, address, web3) => {
  // eslint-disable-next-line no-underscore-dangle
  const _web3 = web3 ?? getWeb3NoAccount();
  return new _web3.eth.Contract(abi, address);
};

export const getVaiTokenContract = web3 => {
  return getContract(vaiTokenAbi, getVaiTokenAddress(), web3);
};

export const getVaiUnitrollerContract = web3 => {
  return getContract(vaiUnitrollerAbi, getVaiUnitrollerAddress(), web3);
};

export const getVaiVaultContract = web3 => {
  return getContract(vaiVaultAbi, getVaiVaultAddress(), web3);
};

export const getXvsVaultContract = web3 => {
  return getContract(xvsVaultAbi, getXvsVaultAddress(), web3);
};

export const getXvsVaultProxyContract = web3 => {
  return getContract(xvsVaultAbi, getXvsVaultProxyAddress(), web3);
};

export const getXvsVaultStoreContract = web3 => {
  return getContract(xvsVaultStoreAbi, getXvsVaultAddress(), web3);
};

export const getTokenContract = (web3, name) => {
  return getContract(
    name === 'xvs' ? xvsAbi : bep20Abi,
    constants.CONTRACT_TOKEN_ADDRESS[name].address,
    web3
  );
};

export const getTokenContractByAddress = (web3, address) => {
  return getContract(vaiTokenAbi, address, web3);
};

export const getVbepContract = (web3, name) => {
  return getContract(
    name === 'bnb' ? vbnbAbi : vbepAbi,
    constants.CONTRACT_VBEP_ADDRESS[name].address,
    web3
  );
};

export const getComptrollerContract = web3 => {
  return getContract(comptrollerAbi, getComptrollerAddress(), web3);
};

export const getPriceOracleContract = web3 => {
  return getContract(oracleAbi, getOracleAddress(), web3);
};

export const getInterestModelContract = (web3, address) => {
  return getContract(interestModelAbi, address, web3);
};

export const getVenusLensContract = web3 => {
  return getContract(venusLensAbi, getVenusLensAddress(), web3);
};

export const getGovernorBravoContract = web3 => {
  return getContract(governorBravoAbi, getGovernorBravoAddress(), web3);
};

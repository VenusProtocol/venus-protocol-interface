import Web3 from 'web3';

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
import governorBravoAbi from 'constants/contracts/abis/governorBravoDelegate.json';
import xvsVestingAbi from 'constants/contracts/abis/xvsVesting.json';
import vrtConverterAbi from 'constants/contracts/abis/vrtConverter.json';
import vrtTokenAbi from 'constants/contracts/abis/vrtToken.json';
import vrtVaultAbi from 'constants/contracts/abis/vrtVault.json';
import { getContractAddress, getToken, getVBepToken } from 'utilities';

const getContract = (abi: $TSFixMe, address: $TSFixMe, web3Instance: Web3) => {
  const web3 = web3Instance ?? getWeb3NoAccount();
  return new web3.eth.Contract(abi, address);
};

export const getTokenContract = (web3: Web3, name: $TSFixMe) => {
  let abi = bep20Abi as $TSFixMe;

  if (name === 'xvs') {
    abi = xvsTokenAbi;
  } else if (name === 'vai') {
    abi = vaiTokenAbi;
  } else if (name === 'vrt') {
    abi = vrtTokenAbi;
  }

  return getContract(abi, getToken(name).address, web3);
};

export const getTokenContractByAddress = (web3: Web3, address: $TSFixMe) =>
  getContract(bep20Abi, address, web3);

export const getVBepTokenContract = (web3: Web3, name: $TSFixMe) =>
  getContract(name === 'bnb' ? vBnbTokenAbi : vBepAbi, getVBepToken(name).address, web3);

export const getVaiUnitrollerContract = (web3: Web3) =>
  getContract(vaiUnitrollerAbi, getContractAddress('vaiUnitroller'), web3);

export const getVaiVaultContract = (web3: Web3) =>
  getContract(vaiVaultAbi, getContractAddress('vaiVault'), web3);

export const getXvsVaultContract = (web3: Web3) =>
  getContract(xvsVaultAbi, getContractAddress('xvsVault'), web3);

export const getXvsVaultProxyContract = (web3: Web3) =>
  getContract(xvsVaultAbi, getContractAddress('xvsVaultProxy'), web3);

export const getXvsVaultStoreContract = (web3: Web3) =>
  getContract(xvsVaultStoreAbi, getContractAddress('xvsVaultStore'), web3);

export const getComptrollerContract = (web3: Web3) =>
  getContract(comptrollerAbi, getContractAddress('comptroller'), web3);

export const getPriceOracleContract = (web3: Web3) =>
  getContract(oracleAbi, getContractAddress('oracle'), web3);

export const getInterestModelContract = (web3: Web3, address: $TSFixMe) =>
  getContract(interestModelAbi, address, web3);

export const getVenusLensContract = (web3: Web3) =>
  getContract(venusLensAbi, getContractAddress('venusLens'), web3);

export const getGovernorBravoContract = (web3: Web3) =>
  getContract(governorBravoAbi, getContractAddress('governorBravoDelegator'), web3);

// VRT conversion
export const getXvsVestingProxyContract = (web3: Web3) =>
  getContract(xvsVestingAbi, getContractAddress('xvsVestingProxy'), web3);

export const getVrtConverterProxyContract = (web3: Web3) =>
  getContract(vrtConverterAbi, getContractAddress('vrtConverterProxy'), web3);

// VRT vault
export const getVrtVaultProxyContract = (web3: Web3) =>
  getContract(vrtVaultAbi, getContractAddress('vrtVaultProxy'), web3);

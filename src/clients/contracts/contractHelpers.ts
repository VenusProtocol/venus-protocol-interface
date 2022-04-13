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
import vbepAbi from 'constants/contracts/abis/vbep.json';
import vbnbAbi from 'constants/contracts/abis/vbnb.json';
import xvsAbi from 'constants/contracts/abis/xvs.json';
import venusLensAbi from 'constants/contracts/abis/venusLens.json';
import governorBravoAbi from 'constants/contracts/abis/governorBravoDelegate.json';
import xvsVestingAbi from 'constants/contracts/abis/xvsVesting.json';
import vrtConverterAbi from 'constants/contracts/abis/vrtConverter.json';
import vrtTokenAbi from 'constants/contracts/abis/vrtToken.json';
import vrtVaultAbi from 'constants/contracts/abis/vrtVault.json';
import { getContractAddress, getToken, getVBepToken } from 'utilities';

const getContract = (abi: $TSFixMe, address: $TSFixMe, web3Contract: Web3) => {
  const web3 = web3Contract ?? getWeb3NoAccount();
  return new web3.eth.Contract(abi, address);
};

export const getVaiTokenContract = (web3: Web3) =>
  getContract(vaiTokenAbi, getContractAddress('vai'), web3);

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

export const getTokenContract = (web3: Web3, name: $TSFixMe) =>
  getContract(name === 'xvs' ? xvsAbi : bep20Abi, getToken(name).address, web3);

export const getTokenContractByAddress = (
  web3: Web3,

  address: $TSFixMe,
) => getContract(vaiTokenAbi, address, web3);

export const getVbepContract = (web3: Web3, name: $TSFixMe) =>
  getContract(name === 'bnb' ? vbnbAbi : vbepAbi, getVBepToken(name).address, web3);

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

export const getVrtTokenContract = (web3: Web3) =>
  getContract(vrtTokenAbi, getContractAddress('vrt'), web3);

// VRT vault
export const getVrtVaultProxyContract = (web3: Web3) =>
  getContract(vrtVaultAbi, getContractAddress('vrtVaultProxy'), web3);

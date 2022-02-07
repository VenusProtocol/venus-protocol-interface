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
  getGovernorBravoAddress,
} from './addressHelpers';
import * as constants from './constants';

const getContract = (abi: $TSFixMe, address: $TSFixMe, web3: $TSFixMe) => {
  // eslint-disable-next-line no-underscore-dangle
  const _web3 = web3 ?? getWeb3NoAccount();
  return new _web3.eth.Contract(abi, address);
};

export const getVaiTokenContract = (web3: $TSFixMe) => getContract(vaiTokenAbi, getVaiTokenAddress(), web3);

export const getVaiUnitrollerContract = (web3: $TSFixMe) => getContract(vaiUnitrollerAbi, getVaiUnitrollerAddress(), web3);

export const getVaiVaultContract = (web3: $TSFixMe) => getContract(vaiVaultAbi, getVaiVaultAddress(), web3);

export const getXvsVaultContract = (web3: $TSFixMe) => getContract(xvsVaultAbi, getXvsVaultAddress(), web3);

export const getXvsVaultProxyContract = (web3: $TSFixMe) => getContract(xvsVaultAbi, getXvsVaultProxyAddress(), web3);

export const getXvsVaultStoreContract = (web3: $TSFixMe) => getContract(xvsVaultStoreAbi, getXvsVaultAddress(), web3);

export const getTokenContract = (web3: $TSFixMe, name: $TSFixMe) => getContract(
  name === 'xvs' ? xvsAbi : bep20Abi,
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  constants.CONTRACT_TOKEN_ADDRESS[name].address,
  web3,
);

export const getTokenContractByAddress = (
  web3: $TSFixMe,

  address: $TSFixMe,
) => getContract(vaiTokenAbi, address, web3);

export const getVbepContract = (web3: $TSFixMe, name: $TSFixMe) => getContract(
  name === 'bnb' ? vbnbAbi : vbepAbi,
  // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  constants.CONTRACT_VBEP_ADDRESS[name].address,
  web3,
);

export const getComptrollerContract = (web3: $TSFixMe) => getContract(comptrollerAbi, getComptrollerAddress(), web3);

export const getPriceOracleContract = (web3: $TSFixMe) => getContract(oracleAbi, getOracleAddress(), web3);

export const getInterestModelContract = (web3: $TSFixMe, address: $TSFixMe) => getContract(interestModelAbi, address, web3);

export const getVenusLensContract = (web3: $TSFixMe) => getContract(venusLensAbi, getVenusLensAddress(), web3);

export const getGovernorBravoContract = (web3: $TSFixMe) => getContract(governorBravoAbi, getGovernorBravoAddress(), web3);

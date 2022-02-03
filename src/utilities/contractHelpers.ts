import { getWeb3NoAccount } from './web3';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/bep20.json'. Co... Remove this comment to see the full error message
import bep20Abi from '../config/abis/bep20.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/comptroller.jso... Remove this comment to see the full error message
import comptrollerAbi from '../config/abis/comptroller.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/interestModel.j... Remove this comment to see the full error message
import interestModelAbi from '../config/abis/interestModel.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/oracle.json'. C... Remove this comment to see the full error message
import oracleAbi from '../config/abis/oracle.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/vaiToken.json'.... Remove this comment to see the full error message
import vaiTokenAbi from '../config/abis/vaiToken.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/vaiUnitroller.j... Remove this comment to see the full error message
import vaiUnitrollerAbi from '../config/abis/vaiUnitroller.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/vaiVault.json'.... Remove this comment to see the full error message
import vaiVaultAbi from '../config/abis/vaiVault.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/xvsVaultStore.j... Remove this comment to see the full error message
import xvsVaultStoreAbi from '../config/abis/xvsVaultStore.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/xvsVault.json'.... Remove this comment to see the full error message
import xvsVaultAbi from '../config/abis/xvsVault.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/vbep.json'. Con... Remove this comment to see the full error message
import vbepAbi from '../config/abis/vbep.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/vbnb.json'. Con... Remove this comment to see the full error message
import vbnbAbi from '../config/abis/vbnb.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/xvs.json'. Cons... Remove this comment to see the full error message
import xvsAbi from '../config/abis/xvs.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/venusLens.json'... Remove this comment to see the full error message
import venusLensAbi from '../config/abis/venusLens.json';
// @ts-expect-error ts-migrate(2732) FIXME: Cannot find module '../config/abis/governorBravoDe... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
const getContract = (abi: $TSFixMe, address: $TSFixMe, web3: $TSFixMe) => {
  // eslint-disable-next-line no-underscore-dangle
  const _web3 = web3 ?? getWeb3NoAccount();
  return new _web3.eth.Contract(abi, address);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getVaiTokenContract = (web3: $TSFixMe) => {
  return getContract(vaiTokenAbi, getVaiTokenAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getVaiUnitrollerContract = (web3: $TSFixMe) => {
  return getContract(vaiUnitrollerAbi, getVaiUnitrollerAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getVaiVaultContract = (web3: $TSFixMe) => {
  return getContract(vaiVaultAbi, getVaiVaultAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getXvsVaultContract = (web3: $TSFixMe) => {
  return getContract(xvsVaultAbi, getXvsVaultAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getXvsVaultProxyContract = (web3: $TSFixMe) => {
  return getContract(xvsVaultAbi, getXvsVaultProxyAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getXvsVaultStoreContract = (web3: $TSFixMe) => {
  return getContract(xvsVaultStoreAbi, getXvsVaultAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getTokenContract = (web3: $TSFixMe, name: $TSFixMe) => {
  return getContract(
    name === 'xvs' ? xvsAbi : bep20Abi,
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    constants.CONTRACT_TOKEN_ADDRESS[name].address,
    web3
  );
};

export const getTokenContractByAddress = (
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  web3: $TSFixMe,
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
  address: $TSFixMe
) => {
  return getContract(vaiTokenAbi, address, web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getVbepContract = (web3: $TSFixMe, name: $TSFixMe) => {
  return getContract(
    name === 'bnb' ? vbnbAbi : vbepAbi,
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    constants.CONTRACT_VBEP_ADDRESS[name].address,
    web3
  );
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getComptrollerContract = (web3: $TSFixMe) => {
  return getContract(comptrollerAbi, getComptrollerAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getPriceOracleContract = (web3: $TSFixMe) => {
  return getContract(oracleAbi, getOracleAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getInterestModelContract = (web3: $TSFixMe, address: $TSFixMe) => {
  return getContract(interestModelAbi, address, web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getVenusLensContract = (web3: $TSFixMe) => {
  return getContract(venusLensAbi, getVenusLensAddress(), web3);
};

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '$TSFixMe'.
export const getGovernorBravoContract = (web3: $TSFixMe) => {
  return getContract(governorBravoAbi, getGovernorBravoAddress(), web3);
};

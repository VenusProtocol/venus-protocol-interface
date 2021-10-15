import Web3 from 'web3';
import * as constants from './constants';

// singleton instance
let web3Instance = null;
export const getWeb3 = () => {
  const providerUrl =
    process.env.REACT_APP_ENV === 'dev'
      ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
      : 'https://bsc-dataseed.binance.org';

  return new Web3(window.ethereum ? window.ethereum : providerUrl);
};

const call = (method, params) => {
  return new Promise((resolve, reject) => {
    method(...params)
      .call()
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const send = (method, params, from) => {
  return new Promise((resolve, reject) => {
    method(...params)
      .send({ from })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const getVaiTokenContract = () => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VAI_TOKEN_ABI),
    constants.CONTRACT_VAI_TOKEN_ADDRESS
  );
};

export const getVaiControllerContract = () => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VAI_CONTROLLER_ABI),
    constants.CONTRACT_VAI_UNITROLLER_ADDRESS
  );
};

export const getVaiVaultContract = () => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VAI_VAULT_ABI),
    constants.CONTRACT_VAI_VAULT_ADDRESS
  );
};

export const getVaultContract = () => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VAULT_ABI),
    constants.CONTRACT_VAULT_ADDRESS
  );
};

export const getTokenContract = name => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(
      name === 'xvs'
        ? constants.CONTRACT_XVS_ABI
        : constants.CONTRACT_BEP20_TOKEN_ABI
    ),
    constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc']
      ? constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc'].address
      : constants.CONTRACT_TOKEN_ADDRESS.usdc.address
  );
};

export const getVbepContract = name => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(
      name !== 'bnb' ? constants.CONTRACT_VBEP_ABI : constants.CONTRACT_VBNB_ABI
    ),
    constants.CONTRACT_VBEP_ADDRESS[name || 'usdc']
      ? constants.CONTRACT_VBEP_ADDRESS[name || 'usdc'].address
      : constants.CONTRACT_VBEP_ADDRESS.usdc.address
  );
};

export const getComptrollerContract = () => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_COMPTROLLER_ABI),
    constants.CONTRACT_COMPTROLLER_ADDRESS
  );
};

export const getPriceOracleContract = (
  address = constants.CONTRACT_PRICE_ORACLE_ADDRESS
) => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_PRICE_ORACLE_ABI),
    address
  );
};

export const getVoteContract = () => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VOTE_ABI),
    constants.CONTRACT_VOTE_ADDRESS
  );
};

export const getInterestModelContract = address => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_INTEREST_MODEL_ABI),
    address
  );
};

export const getVenusLensContract = () => {
  const instance = getWeb3();
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VENUS_LENS_ABI),
    constants.CONTRACT_VENUS_LENS_ADDRESS
  );
};

export const methods = {
  call,
  send
};

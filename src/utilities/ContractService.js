import Web3 from 'web3';
import * as constants from './constants';

// const instance = new Web3(
//   JSON.parse(localStorage.getItem('state')) && JSON.parse(localStorage.getItem('state')).account.setting.walletType === 'binance' ? (process.env.REACT_APP_ENV === 'dev' ? 'https://data-seed-prebsc-1-s1.binance.org:8545' : 'https://bsc-dataseed.binance.org') : window.ethereum
// );

const instance = new Web3(window.ethereum);

const TOKEN_ABI = {
  sxp: constants.CONTRACT_SXP_TOKEN_ABI,
  usdc: constants.CONTRACT_USDC_TOKEN_ABI,
  usdt: constants.CONTRACT_USDT_TOKEN_ABI,
  busd: constants.CONTRACT_BUSD_TOKEN_ABI,
  xvs: constants.CONTRACT_XVS_TOKEN_ABI,
  btcb: constants.CONTRACT_BTCB_TOKEN_ABI,
  eth: constants.CONTRACT_ETH_TOKEN_ABI,
  ltc: constants.CONTRACT_LTC_TOKEN_ABI,
  xrp: constants.CONTRACT_XRP_TOKEN_ABI,
  bch: constants.CONTRACT_BCH_TOKEN_ABI,
  dot: constants.CONTRACT_DOT_TOKEN_ABI,
  link: constants.CONTRACT_LINK_TOKEN_ABI,
  dai: constants.CONTRACT_DAI_TOKEN_ABI,
  fil: constants.CONTRACT_FIL_TOKEN_ABI,
  beth: constants.CONTRACT_BETH_TOKEN_ABI,
  ada: constants.CONTRACT_ADA_TOKEN_ABI,
  doge: constants.CONTRACT_DOGE_TOKEN_ABI
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
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VAI_TOKEN_ABI),
    constants.CONTRACT_VAI_TOKEN_ADDRESS
  );
};

export const getVaiControllerContract = () => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VAI_CONTROLLER_ABI),
    constants.CONTRACT_VAI_UNITROLLER_ADDRESS
  );
};

export const getVaiVaultContract = () => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VAI_VAULT_ABI),
    constants.CONTRACT_VAI_VAULT_ADDRESS
  );
};

export const getTokenContract = name => {
  return new instance.eth.Contract(
    JSON.parse(TOKEN_ABI[name]),
    constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc']
      ? constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc'].address
      : constants.CONTRACT_TOKEN_ADDRESS.usdc.address
  );
};

export const getVbepContract = name => {
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
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_COMPTROLLER_ABI),
    constants.CONTRACT_COMPTROLLER_ADDRESS
  );
};

export const getPriceOracleContract = (
  address = constants.CONTRACT_PRICE_ORACLE_ADDRESS
) => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_PRICE_ORACLE_ABI),
    address
  );
};

export const getVoteContract = () => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_VOTE_ABI),
    constants.CONTRACT_VOTE_ADDRESS
  );
};

export const getInterestModelContract = address => {
  return new instance.eth.Contract(
    JSON.parse(constants.CONTRACT_INTEREST_MODEL_ABI),
    address
  );
};

export const methods = {
  call,
  send
};

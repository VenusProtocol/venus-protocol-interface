const BASE_BSC_SCAN_URLS = {
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com'
};

const API_ENDPOINT_URLS = {
  56: 'https://api.venus.io/api',
  97: 'https://testnetapi.venus.io/api'
};

export const BASE_BSC_SCAN_URL =
  BASE_BSC_SCAN_URLS[process.env.REACT_APP_CHAIN_ID];

export const API_ENDPOINT_URL =
  API_ENDPOINT_URLS[process.env.REACT_APP_CHAIN_ID];

export const connectorLocalStorageKey = 'venus-local-key';

export const vtokenDecimals = 8;

const BASE_BSC_SCAN_URLS = {
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
};

const API_ENDPOINT_URLS = {
  56: 'https://api.venus.io/api',
  97: 'https://testnetapi.venus.io/api',
};

// Note: this is a temporary fix. Once we start refactoring this part we should
// probably fetch the treasury address using the Comptroller contract
const TREASURY_ADDRESSES = {
  56: '0xF322942f644A996A617BD29c16bd7d231d9F35E9',
  // When querying comptroller.treasuryAddress() we get an empty address back,
  // so for now I've let it as it is
  97: '0x0000000000000000000000000000000000000000',
};

export const BASE_BSC_SCAN_URL =
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  BASE_BSC_SCAN_URLS[process.env.REACT_APP_CHAIN_ID];

export const API_ENDPOINT_URL =
  // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
  API_ENDPOINT_URLS[process.env.REACT_APP_CHAIN_ID];

export const connectorLocalStorageKey = 'venus-local-key';

export const vtokenDecimals = 8;

// @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
export const TREASURY_ADDRESS = TREASURY_ADDRESSES[process.env.REACT_APP_CHAIN_ID];

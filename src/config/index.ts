import sample from 'lodash/sample';

export enum BscChainId {
  'MAINNET' = 56,
  'TESTNET' = 97,
}

export const CHAIN_ID: BscChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID, 10)
  : BscChainId.MAINNET;

export const isOnTestnet = CHAIN_ID === BscChainId.TESTNET;

const BASE_BSC_SCAN_URLS = {
  [BscChainId.MAINNET]: 'https://bscscan.com',
  [BscChainId.TESTNET]: 'https://testnet.bscscan.com',
};

const API_ENDPOINT_URLS = {
  [BscChainId.MAINNET]: 'https://api.venus.io/api',
  [BscChainId.TESTNET]: 'https://testnetapi.venus.io/api',
};

export const RPC_URLS: {
  [key: string]: string[];
} = {
  [BscChainId.MAINNET]: [
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed.binance.org',
  ],
  [BscChainId.TESTNET]: [
    'https://speedy-nodes-nyc.moralis.io/6c1fe2e962cdccfe0e93dcb3/bsc/testnet',
  ],
};

export const RPC_URL = sample(RPC_URLS[CHAIN_ID]) as string;

export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[CHAIN_ID];

export const API_ENDPOINT_URL = API_ENDPOINT_URLS[CHAIN_ID];

export const LS_KEY_CONNECTED_CONNECTOR = 'connected-connector';

export const VTOKEN_DECIMALS = 8;

// Note: this is a temporary fix. Once we start refactoring this part we should
// probably fetch the treasury address using the Comptroller contract
const TREASURY_ADDRESSES = {
  56: '0xF322942f644A996A617BD29c16bd7d231d9F35E9',
  // When querying comptroller.treasuryAddress() we get an empty address back,
  // so for now I've let it as it is
  97: '0x0000000000000000000000000000000000000000',
};

export const TREASURY_ADDRESS = TREASURY_ADDRESSES[CHAIN_ID];

export const ETHERSCAN_XVS_CONTRACT_ADDRESS = '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63';
export const VENUS_MEDIUM_URL = 'https://medium.com/@Venus_protocol';
export const VENUS_DISCORD_URL = 'https://discord.com/invite/pTQ9EBHYtF';
export const VENUS_TWITTER_URL = 'https://twitter.com/VenusProtocol';
export const VENUS_GITHUB_URL = 'https://github.com/VenusProtocol/';

// TODO: update
export const VENUS_TERMS_OF_SERVICE_URL = 'https://www.swipe.io/terms';

export const SAFE_BORROW_LIMIT_PERCENTAGE = 80;

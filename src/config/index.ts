import sample from 'lodash/sample';
import { BscChainId } from 'types';

import { BSC_SCAN_URLS } from 'constants/bsc';
import { API_ENDPOINT_URLS, RPC_URLS } from 'constants/endpoints';
import { PROJECT_ID } from 'constants/walletConnect';

export interface Config {
  chainId: BscChainId;
  isOnTestnet: boolean;
  rpcUrl: string;
  apiUrl: string;
  bscScanUrl: string;
  walletConnectProjectId: string;
}

const chainId: BscChainId = process.env.REACT_APP_CHAIN_ID
  ? parseInt(process.env.REACT_APP_CHAIN_ID, 10)
  : BscChainId.MAINNET;

const isOnTestnet = chainId === BscChainId.TESTNET;
const rpcUrl = sample(RPC_URLS[chainId]) as string;
const apiUrl = API_ENDPOINT_URLS[chainId];
const bscScanUrl = BSC_SCAN_URLS[chainId];

const config: Config = {
  chainId,
  isOnTestnet,
  rpcUrl,
  apiUrl,
  bscScanUrl,
  walletConnectProjectId: PROJECT_ID,
};

export default config;

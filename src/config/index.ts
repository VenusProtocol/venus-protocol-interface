import sample from 'lodash/sample';
import { BscChainId } from 'types';

import { BSC_SCAN_URLS } from 'constants/bsc';
import { API_ENDPOINT_URLS, RPC_URLS } from 'constants/endpoints';
import { SENTRY_DSN } from 'constants/sentryDsn';

export interface Config {
  chainId: BscChainId;
  isOnTestnet: boolean;
  rpcUrl: string;
  apiUrl: string;
  bscScanUrl: string;
  sentryDsn: string;
  featureFlags: {
    isolatedPools: boolean;
  };
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
  sentryDsn: SENTRY_DSN,
  featureFlags: {
    isolatedPools: !!process.env.REACT_APP_FF_ISOLATED_POOLS,
  },
};

export default config;

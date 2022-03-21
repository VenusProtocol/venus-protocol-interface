import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';

import { Connector } from './types';
import getNodeUrl from './getRpcUrl';

const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || '', 10);

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
});

const bscConnector = new BscConnector({ supportedChainIds: [chainId] });

const ledger = new LedgerConnector({
  chainId,
  url: rpcUrl,
  pollingInterval: POLLING_INTERVAL,
});

export const injected = new InjectedConnector({ supportedChainIds: [chainId] });

export const connectorsByName = {
  [Connector.MetaMask]: injected,
  [Connector.WalletConnect]: walletconnect,
  [Connector.BSC]: bscConnector,
  [Connector.Ledger]: ledger,
};

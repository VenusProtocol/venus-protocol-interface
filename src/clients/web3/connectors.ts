import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';

import { RPC_URL } from 'config';
import { Connector } from './types';

const POLLING_INTERVAL = 12000;
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || '', 10);

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: RPC_URL },
  qrcode: true,
  // pollingInterval: POLLING_INTERVAL,
});

const bscConnector = new BscConnector({ supportedChainIds: [chainId] });

const ledger = new LedgerConnector({
  chainId,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL,
});

export const injected = new InjectedConnector({ supportedChainIds: [chainId] });

export const connectorsByName = {
  [Connector.MetaMask]: injected,
  [Connector.WalletConnect]: walletconnect,
  [Connector.BSC]: bscConnector,
  [Connector.Ledger]: ledger,
};

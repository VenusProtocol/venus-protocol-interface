import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';

import { RPC_URL, CHAIN_ID } from 'config';
import { Connector } from './types';

const POLLING_INTERVAL = 12000;

const walletConnect = new WalletConnectConnector({
  rpc: { [CHAIN_ID]: RPC_URL },
  qrcode: true,
});

const bscConnector = new BscConnector({ supportedChainIds: [CHAIN_ID] });

const ledger = new LedgerConnector({
  chainId: CHAIN_ID,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL,
});

export const injected = new InjectedConnector({ supportedChainIds: [CHAIN_ID] });

const coinbaseWallet = new WalletLinkConnector({
  url: RPC_URL,
  appName: 'Venus',
});

export const connectorsByName = {
  [Connector.MetaMask]: injected,
  [Connector.WalletConnect]: walletConnect,
  [Connector.BSC]: bscConnector,
  [Connector.Ledger]: ledger,
  [Connector.CoinbaseWallet]: coinbaseWallet,
};

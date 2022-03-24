import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import getNodeUrl from './getRpcUrl';

const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || '97', 10);

export const injected = new InjectedConnector({ supportedChainIds: [chainId] });

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

const coinbaseWallet = new WalletLinkConnector({
  url: rpcUrl,
  appName: 'Venus',
});

export enum ConnectorNames {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
  BSC = 'BSC',
  Ledger = 'Ledger',
  CoinbaseWallet = 'CoinbaseWallet',
}

export const connectorsByName = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.Ledger]: ledger,
  [ConnectorNames.CoinbaseWallet]: coinbaseWallet,
};

export const getLibrary = (provider: $TSFixMe) => provider;

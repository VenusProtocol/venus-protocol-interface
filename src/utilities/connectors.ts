import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import getNodeUrl from './getRpcUrl';

const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
// @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

export const injected = new InjectedConnector({ supportedChainIds: [chainId] });

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});

const bscConnector = new BscConnector({ supportedChainIds: [chainId] });

const ledger = new LedgerConnector({
  chainId,
  url: rpcUrl,
  pollingInterval: POLLING_INTERVAL
});

export const ConnectorNames = {
  Injected: 'MetaMask',
  WalletConnect: 'WalletConnect',
  BSC: 'BSC',
  Ledger: 'Ledger'
};

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.Ledger]: ledger
};


export const getLibrary = (provider: $TSFixMe) => {
  return provider;
};

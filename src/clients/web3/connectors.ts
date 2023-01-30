import { Connector } from './types';

export const connectorIdByName = {
  [Connector.MetaMask]: 'injected',
  [Connector.BraveWallet]: 'injected',
  [Connector.TrustWallet]: 'injected',
  [Connector.OperaWallet]: 'injected',
  [Connector.BitKeep]: 'injected',
  [Connector.InfinityWallet]: 'injected',
  [Connector.SafePal]: 'injected',
  [Connector.CoinbaseWallet]: 'coinbaseWallet',
  [Connector.BinanceChainWallet]: 'bsc',
  [Connector.WalletConnect]: 'walletConnect',
  // TODO: add Ledger connector
};

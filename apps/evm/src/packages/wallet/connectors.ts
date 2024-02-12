import { Connector } from './types';

export const connectorIdByName: {
  [connector in Connector]:
    | 'metaMask'
    | 'injected'
    | 'coinbaseWallet'
    | 'walletConnect'
    | 'BinanceW3W';
} = {
  [Connector.BinanceWallet]: 'BinanceW3W',
  [Connector.MetaMask]: 'metaMask',
  [Connector.BraveWallet]: 'injected',
  [Connector.TrustWallet]: 'injected',
  [Connector.OperaWallet]: 'injected',
  [Connector.OkxWallet]: 'injected',
  [Connector.BitKeep]: 'injected',
  [Connector.InfinityWallet]: 'injected',
  [Connector.SafePal]: 'injected',
  [Connector.RabbyWallet]: 'injected',
  [Connector.CoinbaseWallet]: 'coinbaseWallet',
  [Connector.WalletConnect]: 'walletConnect',
};

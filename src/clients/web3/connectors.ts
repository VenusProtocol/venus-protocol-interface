import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { BscConnector } from '@binance-chain/bsc-connector';

import { RPC_URL, CHAIN_ID, BscChainId } from 'config';
import { Connector } from './types';

export const injectedConnector = new InjectedConnector({ supportedChainIds: [CHAIN_ID] });

const walletConnectConnector = new WalletConnectConnector({
  rpc: { [BscChainId.MAINNET]: RPC_URL },
  chainId: BscChainId.MAINNET,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});

const binanceChainWalletConnector = new BscConnector({ supportedChainIds: [CHAIN_ID] });

const coinbaseWalletConnector = new WalletLinkConnector({
  url: RPC_URL,
  appName: 'Venus',
});

export const connectorsByName = {
  [Connector.MetaMask]: injectedConnector,
  [Connector.WalletConnect]: walletConnectConnector,
  [Connector.CoinbaseWallet]: coinbaseWalletConnector,
  [Connector.TrustWallet]: injectedConnector,
  [Connector.BinanceChainWallet]: binanceChainWalletConnector,
};

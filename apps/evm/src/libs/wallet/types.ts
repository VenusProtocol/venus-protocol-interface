import type {
  BaseProvider,
  FallbackProvider,
  JsonRpcProvider,
  JsonRpcSigner,
} from '@ethersproject/providers';

export type ConnectorId =
  | 'BinanceW3WSDK'
  | 'coinbaseWalletSDK'
  | 'io.metamask'
  | 'io.rabby'
  | 'io.gate.wallet'
  | 'io.infinitywallet'
  | 'com.okex.wallet'
  | 'com.bitget.web3'
  | 'com.brave.wallet'
  | 'walletConnect'
  | 'injected';

export type BaseWallet = {
  name: string;
  logoSrc: string;
};

export type Wallet = BaseWallet & {
  connectorId: ConnectorId;
  mainnetOnly?: boolean;
};

// Integrated wallets represent wallets that are integrated through third-party
// apps but not directly from our dApp. These wallets are displayed on the UI as
// options that on click redirect to a web page explaining how to set them up
// through a third-party app (e.g.: MetaMask).
export type IntegratedWallet = BaseWallet & {
  linkUrl: string;
};

export type Provider = JsonRpcProvider | FallbackProvider | BaseProvider;

export type Signer = JsonRpcSigner;

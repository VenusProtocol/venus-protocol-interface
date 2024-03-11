import type { BaseProvider, FallbackProvider, JsonRpcProvider } from '@ethersproject/providers';

export enum Connector {
  BinanceWallet = 'BinanceW3W',
  MetaMask = 'MetaMask',
  TrustWallet = 'TrustWallet',
  WalletConnect = 'WalletConnect',
  SafePal = 'SafePal',
  CoinbaseWallet = 'CoinbaseWallet',
  BraveWallet = 'BraveWallet',
  InfinityWallet = 'InfinityWallet',
  OkxWallet = 'OkxWallet',
  OperaWallet = 'OperaWallet',
  BitKeep = 'BitKeep',
  RabbyWallet = 'RabbyWallet',
}

export type Provider = JsonRpcProvider | FallbackProvider | BaseProvider;

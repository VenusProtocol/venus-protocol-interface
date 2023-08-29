import { BaseProvider, FallbackProvider, JsonRpcProvider } from '@ethersproject/providers';

export enum Connector {
  MetaMask = 'MetaMask',
  TrustWallet = 'TrustWallet',
  WalletConnect = 'WalletConnect',
  SafePal = 'SafePal',
  CoinbaseWallet = 'CoinbaseWallet',
  BinanceChainWallet = 'BinanceChainWallet',
  BraveWallet = 'BraveWallet',
  InfinityWallet = 'InfinityWallet',
  OkxWallet = 'OkxWallet',
  OperaWallet = 'OperaWallet',
  BitKeep = 'BitKeep',
  RabbyWallet = 'RabbyWallet',
}

export type Provider = JsonRpcProvider | FallbackProvider | BaseProvider;

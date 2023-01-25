export const isRunningInOperaBrowser = () => window.ethereum?.isOpera;

export const isRunningInBinanceChainWallet = () => !!window.BinanceChain;

export const isRunningInInfinityWalletApp = () =>
  window.ethereum && window.ethereum?.isInfinityWallet;

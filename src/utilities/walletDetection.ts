export const isRunningInOperaBrowser = () => window.ethereum?.isOpera;

export const isRunningInInfinityWalletApp = () =>
  window.ethereum && 'isInfinityWallet' in window.ethereum;

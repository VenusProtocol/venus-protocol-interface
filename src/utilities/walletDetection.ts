export const isRunningInOperaBrowser = () => window.ethereum?.isOpera;

export const isRunningInInfinityWalletApp = () =>
  window.ethereum && window.ethereum?.isInfinityWallet;

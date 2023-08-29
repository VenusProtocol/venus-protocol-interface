export const isRunningInOperaBrowser = () => (window.ethereum as WindowEthereum)?.isOpera;

export const isRunningInInfinityWalletApp = () =>
  (window.ethereum as WindowEthereum)?.isInfinityWallet;

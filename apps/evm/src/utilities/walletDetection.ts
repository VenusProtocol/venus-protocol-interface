export const isRunningInOperaBrowser = () => (window.ethereum as WindowEthereum)?.isOpera;

export const isRunningInBinanceApp = () => (window.ethereum as WindowEthereum)?.isBinance;

export const isRunningInInfinityWalletApp = () =>
  (window.ethereum as WindowEthereum)?.isInfinityWallet;

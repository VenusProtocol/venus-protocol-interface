export const canAddTokenToWallet = () =>
  typeof window !== 'undefined' &&
  ((window?.ethereum as WindowEthereum)?.isMetaMask ||
    (window?.ethereum as WindowEthereum)?.isTrust ||
    (window?.ethereum as WindowEthereum)?.isCoinbaseWallet);

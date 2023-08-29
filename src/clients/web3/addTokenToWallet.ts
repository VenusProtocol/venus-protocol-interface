import { Token } from 'types';

export const canRegisterToken = () =>
  typeof window !== 'undefined' &&
  ((window?.ethereum as WindowEthereum)?.isMetaMask ||
    (window?.ethereum as WindowEthereum)?.isTrust ||
    (window?.ethereum as WindowEthereum)?.isCoinbaseWallet);

const addTokenToWallet = async (token: Token) =>
  (window?.ethereum as WindowEthereum)?.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        image: `${window.location.origin}${token.asset}`,
      },
    },
  });

export default addTokenToWallet;

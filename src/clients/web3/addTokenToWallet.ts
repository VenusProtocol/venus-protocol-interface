import { Token } from 'types';

export const canRegisterToken = () =>
  typeof window !== 'undefined' &&
  (window?.ethereum?.isMetaMask || window?.ethereum?.isTrust || window?.ethereum?.isCoinbaseWallet);

const addTokenToWallet = async (token: Token) =>
  window.ethereum?.request({
    // @ts-expect-error Wagmi's type for request method is incorrect in the
    // current version
    method: 'wallet_watchAsset',
    params: {
      // @ts-expect-error Wagmi's type for request method 1is incorrect in the
      // current version
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

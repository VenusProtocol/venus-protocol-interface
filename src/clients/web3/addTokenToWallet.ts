import { Token } from 'types';

export const canRegisterToken = () =>
  typeof window !== 'undefined' &&
  (window?.ethereum?.isMetaMask || window?.ethereum?.isTrust || window?.ethereum?.isCoinbaseWallet);

const addTokenToWallet = async (token: Token) =>
  window.ethereum?.request({
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

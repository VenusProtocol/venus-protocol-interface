import { TokenId } from 'types';
import { getToken } from 'utilities';

import { isRunningInBinanceChainWallet } from './walletDetectionUtils';

const addTokenToWallet = async (tokenId: TokenId) => {
  const token = getToken(tokenId);
  const isInBCW = isRunningInBinanceChainWallet();

  return (isInBCW ? (window.BinanceChain as Record<string, string>) : window.ethereum)?.request({
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
};

export default addTokenToWallet;

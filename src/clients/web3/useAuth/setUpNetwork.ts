import config from 'config';

import { RPC_URLS } from 'constants/endpoints';

// Prompt the user to add BSC as a network, or switch to BSC if the wallet is on
// a different network
const setUpNetwork = async () => {
  if (!window.ethereum) {
    // TODO: send error to Sentry

    console.error("Can't set up the BSC network on wallet because window.ethereum is undefined");
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${config.chainId.toString(16)}`,
          chainName: config.isOnTestnet
            ? 'Binance Smart Chain Testnet'
            : 'Binance Smart Chain Mainnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'bnb',
            decimals: 18,
          },
          rpcUrls: RPC_URLS[config.chainId],
          blockExplorerUrls: [`${config.bscScanUrl}/`],
        },
      ],
    });

    return true;
  } catch (error) {
    // TODO: send error to Sentry

    console.error('Failed to set up network on wallet:', error);
    return false;
  }
};

export default setUpNetwork;

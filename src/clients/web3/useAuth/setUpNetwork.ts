import { BASE_BSC_SCAN_URL, CHAIN_ID, BscChainId, RPC_URLS } from 'config';

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
          chainId: `0x${CHAIN_ID.toString(16)}`,
          chainName:
            CHAIN_ID === BscChainId.MAINNET
              ? 'Binance Smart Chain Mainnet'
              : 'Binance Smart Chain Testnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'bnb',
            decimals: 18,
          },
          rpcUrls: RPC_URLS[CHAIN_ID],
          blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
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

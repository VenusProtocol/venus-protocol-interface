import { BASE_BSC_SCAN_URL } from 'config';
import { nodes } from '../../../utilities/getRpcUrl';

// Prompt the user to add BSC as a network, or switch to BSC if the wallet is on
// a different network
const setUpNetwork = async () => {
  if (!window.ethereum) {
    // TODO: send error to Sentry

    console.error(
      "Can't set up the BSC network on browser wallet because window.ethereum is undefined",
    );
    return false;
  }

  if (!process.env.REACT_APP_CHAIN_ID) {
    console.error('Missing environment variable: REACT_APP_CHAIN_ID');

    return false;
  }

  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${chainId.toString(16)}`,
          chainName: chainId === 56 ? 'Binance Smart Chain Mainnet' : 'Binance Smart Chain Testnet',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'bnb',
            decimals: 18,
          },
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          rpcUrls: nodes[chainId],
          blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
        },
      ],
    });

    return true;
  } catch (error) {
    // TODO: send error to Sentry

    console.error('Failed to set up network on browser wallet:', error);
    return false;
  }
};

export default setUpNetwork;

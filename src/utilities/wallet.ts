// Set of helper functions to facilitate wallet setup
import { BASE_BSC_SCAN_URL } from '../config';
import { nodes } from './getRpcUrl';

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'ethereum' does not exist on type 'Window... Remove this comment to see the full error message
  const provider = window.ethereum;
  if (provider) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName:
              chainId === 56
                ? 'Binance Smart Chain Mainnet'
                : 'Binance Smart Chain Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18
            },
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            rpcUrls: nodes[chainId],
            blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`]
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

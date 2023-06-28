import { SwapRouterAddressMapping } from 'types';
import { getContractAddress } from 'utilities';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller').toLowerCase();

export const MAINNET_SWAP_ROUTERS: SwapRouterAddressMapping = {
  // Main pool
  [MAIN_POOL_COMPTROLLER_ADDRESS]: '0x8938E6dA30b59c1E27d5f70a94688A89F7c815a4',
  // TODO: add isolated pools
};

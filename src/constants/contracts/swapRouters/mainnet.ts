import isolatedLendingMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet.json';
import { SwapRouterAddressMapping } from 'types';
import { getContractAddress } from 'utilities';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller').toLowerCase();

const STABLE_COINS_POOL_COMPTROLLER_ADDRESS =
  isolatedLendingMainnetDeployments.contracts.Comptroller_Stablecoins.address.toLowerCase();

const STABLE_COINS_POOL_SWAP_ROUTER_ADDRESS =
  isolatedLendingMainnetDeployments.contracts.SwapRouter_Stablecoins.address.toLowerCase();

export const MAINNET_SWAP_ROUTERS: SwapRouterAddressMapping = {
  // Main pool
  [MAIN_POOL_COMPTROLLER_ADDRESS]: '0x8938E6dA30b59c1E27d5f70a94688A89F7c815a4',
  [STABLE_COINS_POOL_COMPTROLLER_ADDRESS]: STABLE_COINS_POOL_SWAP_ROUTER_ADDRESS,
};

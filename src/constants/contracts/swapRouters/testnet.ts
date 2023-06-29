import isolatedLendingTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import { SwapRouterAddressMapping } from 'types';
import { getContractAddress } from 'utilities';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller').toLowerCase();

const STABLE_COINS_POOL_COMPTROLLER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.Comptroller_StableCoins.address.toLowerCase();

export const TESTNET_SWAP_ROUTERS: SwapRouterAddressMapping = {
  // Main pool
  [MAIN_POOL_COMPTROLLER_ADDRESS]: '0x83edf1dee1b730b7e8e13c00ba76027d63a51ac0',
  // Isolated pools
  [STABLE_COINS_POOL_COMPTROLLER_ADDRESS]: '0xca59d9e8889bc6034ccd749c4ddd09c865432ba8',
};

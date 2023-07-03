import isolatedLendingTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import { SwapRouterAddressMapping } from 'types';
import { getContractAddress } from 'utilities';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller').toLowerCase();

const STABLE_COINS_POOL_COMPTROLLER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.Comptroller_StableCoins.address.toLowerCase();
const STABLE_COINS_POOL_SWAP_ROUTER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.SwapRouter_StableCoins.address.toLowerCase();

const TRON_POOL_COMPTROLLER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.Comptroller_Tron.address.toLowerCase();
const TRON_POOL_SWAP_ROUTER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.SwapRouter_Tron.address.toLowerCase();

const GAMEFI_POOL_COMPTROLLER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.Comptroller_GameFi.address.toLowerCase();
const GAMEFI_POOL_SWAP_ROUTER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.SwapRouter_GameFi.address.toLowerCase();

const DEFI_POOL_COMPTROLLER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.Comptroller_DeFi.address.toLowerCase();
const DEFI_POOL_SWAP_ROUTER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.SwapRouter_DeFi.address.toLowerCase();

const LIQUID_STAKED_BNB_POOL_COMPTROLLER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.Comptroller_LiquidStakedBNB.address.toLowerCase();
const LIQUID_STAKED_BNB_POOL_SWAP_ROUTER_ADDRESS =
  isolatedLendingTestnetDeployments.contracts.SwapRouter_LiquidStakedBNB.address.toLowerCase();

export const TESTNET_SWAP_ROUTERS: SwapRouterAddressMapping = {
  // Main pool
  [MAIN_POOL_COMPTROLLER_ADDRESS]: '0x83edf1dee1b730b7e8e13c00ba76027d63a51ac0',
  // Isolated pools
  [STABLE_COINS_POOL_COMPTROLLER_ADDRESS]: STABLE_COINS_POOL_SWAP_ROUTER_ADDRESS,
  [TRON_POOL_COMPTROLLER_ADDRESS]: TRON_POOL_SWAP_ROUTER_ADDRESS,
  [GAMEFI_POOL_COMPTROLLER_ADDRESS]: GAMEFI_POOL_SWAP_ROUTER_ADDRESS,
  [DEFI_POOL_COMPTROLLER_ADDRESS]: DEFI_POOL_SWAP_ROUTER_ADDRESS,
  [LIQUID_STAKED_BNB_POOL_COMPTROLLER_ADDRESS]: LIQUID_STAKED_BNB_POOL_SWAP_ROUTER_ADDRESS,
};

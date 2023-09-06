import type { JsonFragment } from '@ethersproject/abi';
import isolatedPoolsMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet.json';
import isolatedPoolsTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import { abi as swapRouterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Swap/SwapRouter.sol/SwapRouter.json';
import venusProtocolMainnetDeployments from '@venusprotocol/venus-protocol/networks/mainnet.json';
import venusProtocolTestnetDeployments from '@venusprotocol/venus-protocol/networks/testnet.json';
import { ChainId } from 'types';

import { SwapRouter } from '../types/contracts/venusProtocol';

export interface SwapRouterContractInfo {
  abi: JsonFragment[];
  address: Partial<{
    [chainId in ChainId]: {
      [poolComptrollerAddress: string]: string;
    };
  }>;
}

const swapRouter: SwapRouterContractInfo = {
  abi: swapRouterAbi,
  address: {
    [ChainId.BSC_TESTNET]: {
      // Main pool
      [venusProtocolTestnetDeployments.Unitroller.address.toLowerCase()]:
        venusProtocolTestnetDeployments.Contracts.SwapRouterCorePool,
      // Isolated pools
      [isolatedPoolsTestnetDeployments.contracts.Comptroller_StableCoins.address.toLowerCase()]:
        isolatedPoolsTestnetDeployments.contracts.SwapRouter_StableCoins.address,
      [isolatedPoolsTestnetDeployments.contracts.Comptroller_Tron.address.toLowerCase()]:
        isolatedPoolsTestnetDeployments.contracts.SwapRouter_Tron.address,
      [isolatedPoolsTestnetDeployments.contracts.Comptroller_GameFi.address.toLowerCase()]:
        isolatedPoolsTestnetDeployments.contracts.SwapRouter_GameFi.address,
      [isolatedPoolsTestnetDeployments.contracts.Comptroller_DeFi.address.toLowerCase()]:
        isolatedPoolsTestnetDeployments.contracts.SwapRouter_DeFi.address,
      [isolatedPoolsTestnetDeployments.contracts.Comptroller_LiquidStakedBNB.address.toLowerCase()]:
        isolatedPoolsTestnetDeployments.contracts.SwapRouter_LiquidStakedBNB.address,
    },
    [ChainId.BSC_MAINNET]: {
      // Main pool
      [venusProtocolMainnetDeployments.Unitroller.address.toLowerCase()]:
        venusProtocolMainnetDeployments.Contracts.SwapRouterCorePool,
      // Isolated Pools
      [isolatedPoolsMainnetDeployments.contracts.Comptroller_Stablecoins.address.toLowerCase()]:
        isolatedPoolsMainnetDeployments.contracts.SwapRouter_Stablecoins.address,
      [isolatedPoolsMainnetDeployments.contracts.Comptroller_Tron.address.toLowerCase()]:
        isolatedPoolsMainnetDeployments.contracts.SwapRouter_Tron.address,
      [isolatedPoolsMainnetDeployments.contracts.Comptroller_GameFi.address.toLowerCase()]:
        isolatedPoolsMainnetDeployments.contracts.SwapRouter_GameFi.address,
      [isolatedPoolsMainnetDeployments.contracts.Comptroller_DeFi.address.toLowerCase()]:
        isolatedPoolsMainnetDeployments.contracts.SwapRouter_DeFi.address,
      [isolatedPoolsMainnetDeployments.contracts.Comptroller_LiquidStakedBNB.address.toLowerCase()]:
        isolatedPoolsMainnetDeployments.contracts.SwapRouter_LiquidStakedBNB.address,
    },
  },
};

export type SwapRouterContractName = 'swapRouter';
export type SwapRouterContractType = SwapRouter;

export default swapRouter;

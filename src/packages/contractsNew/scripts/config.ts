import { abi as isolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import isolatedPoolsMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet.json';
import isolatedPoolsTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import { abi as mainPoolComptrollerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Comptroller/Comptroller.sol/Comptroller.json';
import { abi as venusLensAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Lens/VenusLens.sol/VenusLens.json';
import { abi as swapRouterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Swap/SwapRouter.sol/SwapRouter.json';
import venusProtocolMainnetDeployments from '@venusprotocol/venus-protocol/networks/mainnet.json';
import venusProtocolTestnetDeployments from '@venusprotocol/venus-protocol/networks/testnet.json';
import { type ContractInterface } from 'ethers';
import { ChainId } from 'types';

export interface UniqueContractConfig {
  name: string;
  abi: ContractInterface;
  address: Partial<{
    [chainId in ChainId]: string;
  }>;
}

export interface GenericContractConfig {
  name: string;
  abi: ContractInterface;
}

export interface SwapRouterContractConfig {
  name: string;
  abi: ContractInterface;
  address: Partial<{
    [chainId in ChainId]: {
      [comptrollerContractAddress: string]: string;
    };
  }>;
}

export type ContractConfig =
  | UniqueContractConfig
  | GenericContractConfig
  | SwapRouterContractConfig;

export const contracts: ContractConfig[] = [
  // Unique contracts
  {
    name: 'VenusLens',
    abi: venusLensAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.VenusLens,
      [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VenusLens,
    },
  },
  {
    name: 'MainPoolComptroller',
    abi: mainPoolComptrollerAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.Unitroller,
      [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.Unitroller,
    },
  },
  // TODO: add all contracts
  // Generic Contracts
  {
    name: 'IsolatedPoolComptroller',
    abi: isolatedPoolComptrollerAbi,
  },
  // TODO: add all contracts
  // SwapRouter contract
  {
    name: 'SwapRouter',
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
  },
];

export default contracts;

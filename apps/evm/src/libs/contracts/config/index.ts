import type { Abi } from 'viem';

import { abi as OmnichainGovernanceExecutorAbi } from '@venusprotocol/governance-contracts/artifacts/contracts/Cross-chain/OmnichainGovernanceExecutor.sol/OmnichainGovernanceExecutor.json';
import { abi as GovernorBravoDelegateAbi } from '@venusprotocol/governance-contracts/artifacts/contracts/Governance/GovernorBravoDelegate.sol/GovernorBravoDelegate.json';
import venusGovernanceArbitrumOneDeployments from '@venusprotocol/governance-contracts/deployments/arbitrumone_addresses.json';
import venusGovernanceArbitrumSepoliaDeployments from '@venusprotocol/governance-contracts/deployments/arbitrumsepolia_addresses.json';
import venusGovernanceBaseMainnetDeployments from '@venusprotocol/governance-contracts/deployments/basemainnet_addresses.json';
import venusGovernanceBaseSepoliaDeployments from '@venusprotocol/governance-contracts/deployments/basesepolia_addresses.json';
import venusGovernanceBscMainnetDeployments from '@venusprotocol/governance-contracts/deployments/bscmainnet_addresses.json';
import venusGovernanceBscTestnetDeployments from '@venusprotocol/governance-contracts/deployments/bsctestnet_addresses.json';
import venusGovernanceEthereumDeployments from '@venusprotocol/governance-contracts/deployments/ethereum_addresses.json';
import venusGovernanceOpBnbMainnetDeployments from '@venusprotocol/governance-contracts/deployments/opbnbmainnet_addresses.json';
import venusGovernanceOpBnbTestnetDeployments from '@venusprotocol/governance-contracts/deployments/opbnbtestnet_addresses.json';
import venusGovernanceOptimismMainnetDeployments from '@venusprotocol/governance-contracts/deployments/opmainnet_addresses.json';
import venusGovernanceOptimismSepoliaDeployments from '@venusprotocol/governance-contracts/deployments/opsepolia_addresses.json';
import venusGovernanceSepoliaDeployments from '@venusprotocol/governance-contracts/deployments/sepolia_addresses.json';
import venusGovernanceUnichainMainnetDeployments from '@venusprotocol/governance-contracts/deployments/unichainmainnet_addresses.json';
import venusGovernanceUnichainSepoliaDeployments from '@venusprotocol/governance-contracts/deployments/unichainsepolia_addresses.json';
import venusGovernanceZkSyncMainnetDeployments from '@venusprotocol/governance-contracts/deployments/zksyncmainnet_addresses.json';
import venusGovernanceZkSyncSepoliaDeployments from '@venusprotocol/governance-contracts/deployments/zksyncsepolia_addresses.json';
import { abi as IsolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as NativeTokenGatewayAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Gateway/NativeTokenGateway.sol/NativeTokenGateway.json';
import { abi as JumpRateModelV2Abi } from '@venusprotocol/isolated-pools/artifacts/contracts/JumpRateModelV2.sol/JumpRateModelV2.json';
import { abi as PoolLensAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Lens/PoolLens.sol/PoolLens.json';
import { abi as PoolRegistryAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Pool/PoolRegistry.sol/PoolRegistry.json';
import { abi as RewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { abi as VBep20Abi } from '@venusprotocol/isolated-pools/artifacts/contracts/VToken.sol/VToken.json';
import isolatedPoolsArbitrumOneDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumone_addresses.json';
import isolatedPoolsArbitrumSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumsepolia_addresses.json';
import isolatedPoolsBaseMainnetDeployments from '@venusprotocol/isolated-pools/deployments/basemainnet_addresses.json';
import isolatedPoolsBaseSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/basesepolia_addresses.json';
import isolatedPoolsBscMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet_addresses.json';
import isolatedPoolsBscTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet_addresses.json';
import isolatedPoolsEthereumDeployments from '@venusprotocol/isolated-pools/deployments/ethereum_addresses.json';
import isolatedPoolsOpBnbMainnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbmainnet_addresses.json';
import isolatedPoolsOpBnbTestnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbtestnet_addresses.json';
import isolatedPoolsOptimismMainnetDeployments from '@venusprotocol/isolated-pools/deployments/opmainnet_addresses.json';
import isolatedPoolsOptimismSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/opsepolia_addresses.json';
import isolatedPoolsSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/sepolia_addresses.json';
import isolatedPoolsUnichainMainnetDeployments from '@venusprotocol/isolated-pools/deployments/unichainmainnet_addresses.json';
import isolatedPoolsUnichainSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/unichainsepolia_addresses.json';
import isolatedPoolsZkSyncMainnetDeployments from '@venusprotocol/isolated-pools/deployments/zksyncmainnet_addresses.json';
import isolatedPoolsZkSyncSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/zksyncsepolia_addresses.json';
import { abi as ResilientOracleAbi } from '@venusprotocol/oracle/artifacts/contracts/ResilientOracle.sol/ResilientOracle.json';
import venusOracleArbitrumOneDeployments from '@venusprotocol/oracle/deployments/arbitrumone_addresses.json';
import venusOracleArbitrumSepoliaDeployments from '@venusprotocol/oracle/deployments/arbitrumsepolia_addresses.json';
import venusOracleBaseMainnetDeployments from '@venusprotocol/oracle/deployments/basemainnet_addresses.json';
import venusOracleBaseSepoliaDeployments from '@venusprotocol/oracle/deployments/basesepolia_addresses.json';
import venusOracleBscMainnetDeployments from '@venusprotocol/oracle/deployments/bscmainnet_addresses.json';
import venusOracleBscTestnetDeployments from '@venusprotocol/oracle/deployments/bsctestnet_addresses.json';
import venusOracleEthereumDeployments from '@venusprotocol/oracle/deployments/ethereum_addresses.json';
import venusOracleOpBnbMainnetDeployments from '@venusprotocol/oracle/deployments/opbnbmainnet_addresses.json';
import venusOracleOpBnbTestnetDeployments from '@venusprotocol/oracle/deployments/opbnbtestnet_addresses.json';
import venusOracleOptimismMainnetDeployments from '@venusprotocol/oracle/deployments/opmainnet_addresses.json';
import venusOracleOptimismSepoliaDeployments from '@venusprotocol/oracle/deployments/opsepolia_addresses.json';
import venusOracleSepoliaDeployments from '@venusprotocol/oracle/deployments/sepolia_addresses.json';
import venusOracleUnichainMainnetDeployments from '@venusprotocol/oracle/deployments/unichainmainnet_addresses.json';
import venusOracleUnichainSepoliaDeployments from '@venusprotocol/oracle/deployments/unichainsepolia_addresses.json';
import venusOracleZkSyncMainnetDeployments from '@venusprotocol/oracle/deployments/zksyncmainnet_addresses.json';
import venusOracleZkSyncSepoliaDeployments from '@venusprotocol/oracle/deployments/zksyncsepolia_addresses.json';
import { abi as XVSProxyOFTDestAbi } from '@venusprotocol/token-bridge/artifacts/contracts/Bridge/XVSProxyOFTDest.sol/XVSProxyOFTDest.json';
import { abi as XVSProxyOFTSrcAbi } from '@venusprotocol/token-bridge/artifacts/contracts/Bridge/XVSProxyOFTSrc.sol/XVSProxyOFTSrc.json';
import { abi as XvsTokenOmnichainAbi } from '@venusprotocol/token-bridge/artifacts/contracts/Bridge/token/XVS.sol/XVS.json';
import tokenBridgeArbitrumOneDeployments from '@venusprotocol/token-bridge/deployments/arbitrumone_addresses.json';
import tokenBridgeArbitrumSepoliaDeployments from '@venusprotocol/token-bridge/deployments/arbitrumsepolia_addresses.json';
import tokenBridgeBaseMainnetDeployments from '@venusprotocol/token-bridge/deployments/basemainnet_addresses.json';
import tokenBridgeBaseSepoliaDeployments from '@venusprotocol/token-bridge/deployments/basesepolia_addresses.json';
import tokenBridgeBscMainnetDeployments from '@venusprotocol/token-bridge/deployments/bscmainnet_addresses.json';
import tokenBridgeBscTestnetDeployments from '@venusprotocol/token-bridge/deployments/bsctestnet_addresses.json';
import tokenBridgeEthereumDeployments from '@venusprotocol/token-bridge/deployments/ethereum_addresses.json';
import tokenBridgeOpBnbMainnetDeployments from '@venusprotocol/token-bridge/deployments/opbnbmainnet_addresses.json';
import tokenBridgeOpBnbTestnetDeployments from '@venusprotocol/token-bridge/deployments/opbnbtestnet_addresses.json';
import tokenBridgeOptimismMainnetDeployments from '@venusprotocol/token-bridge/deployments/opmainnet_addresses.json';
import tokenBridgeOptimismSepoliaDeployments from '@venusprotocol/token-bridge/deployments/opsepolia_addresses.json';
import tokenBridgeSepoliaDeployments from '@venusprotocol/token-bridge/deployments/sepolia_addresses.json';
import tokenBridgeUnichainMainnetDeployments from '@venusprotocol/token-bridge/deployments/unichainmainnet_addresses.json';
import tokenBridgeUnichainSepoliaDeployments from '@venusprotocol/token-bridge/deployments/unichainsepolia_addresses.json';
import tokenBridgeZkSyncMainnetDeployments from '@venusprotocol/token-bridge/deployments/zksyncmainnet_addresses.json';
import tokenBridgeZkSyncSepoliaDeployments from '@venusprotocol/token-bridge/deployments/zksyncsepolia_addresses.json';
import { abi as leverageManagerAbi } from '@venusprotocol/venus-periphery/artifacts/contracts/LeverageManager/LeverageStrategiesManager.sol/LeverageStrategiesManager.json';
import venusPeripheryBscMainnetDeployments from '@venusprotocol/venus-periphery/deployments/bscmainnet_addresses.json';
import { abi as legacyPoolComptrollerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Comptroller/Diamond/DiamondConsolidated.sol/DiamondConsolidated.json';
import { abi as vTreasuryAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Governance/VTreasury.sol/VTreasury.json';
import { abi as vTreasuryV8Abi } from '@venusprotocol/venus-protocol/artifacts/contracts/Governance/VTreasuryV8.sol/VTreasuryV8.json';
import { abi as jumpRateModelAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/InterestRateModels/JumpRateModel.sol/JumpRateModel.json';
import { abi as venusLensAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Lens/VenusLens.sol/VenusLens.json';
import { abi as swapRouterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Swap/SwapRouter.sol/SwapRouter.json';
import { abi as primeAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/Prime/Prime.sol/Prime.json';
import { abi as vaiAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VAI/VAI.sol/VAI.json';
import { abi as vaiControllerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VAI/VAIController.sol/VAIController.json';
import { abi as vrtAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VRT/VRT.sol/VRT.json';
import { abi as vrtConverterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VRT/VRTConverter.sol/VRTConverter.json';
import { abi as xvsAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/XVS/XVS.sol/XVS.json';
import { abi as xvsVestingAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/XVS/XVSVesting.sol/XVSVesting.json';
import { abi as vaiVaultAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/VAIVault/VAIVault.sol/VAIVault.json';
import { abi as xvsStoreAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/XVSVault/XVSStore.sol/XVSStore.json';
import { abi as xvsVaultAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/XVSVault/XVSVault.sol/XVSVault.json';
import venusProtocolArbitrumOneDeployments from '@venusprotocol/venus-protocol/deployments/arbitrumone_addresses.json';
import venusProtocolArbitrumSepoliaDeployments from '@venusprotocol/venus-protocol/deployments/arbitrumsepolia_addresses.json';
import venusProtocolBaseMainnetDeployments from '@venusprotocol/venus-protocol/deployments/basemainnet_addresses.json';
import venusProtocolBaseSepoliaDeployments from '@venusprotocol/venus-protocol/deployments/basesepolia_addresses.json';
import venusProtocolBscMainnetDeployments from '@venusprotocol/venus-protocol/deployments/bscmainnet_addresses.json';
import venusProtocolBscTestnetDeployments from '@venusprotocol/venus-protocol/deployments/bsctestnet_addresses.json';
import venusProtocolEthereumDeployments from '@venusprotocol/venus-protocol/deployments/ethereum_addresses.json';
import venusProtocolOpBnbMainnetDeployments from '@venusprotocol/venus-protocol/deployments/opbnbmainnet_addresses.json';
import venusProtocolOpBnbTestnetDeployments from '@venusprotocol/venus-protocol/deployments/opbnbtestnet_addresses.json';
import venusProtocolOptimismMainnetDeployments from '@venusprotocol/venus-protocol/deployments/opmainnet_addresses.json';
import venusProtocolOptimismSepoliaDeployments from '@venusprotocol/venus-protocol/deployments/opsepolia_addresses.json';
import venusProtocolSepoliaDeployments from '@venusprotocol/venus-protocol/deployments/sepolia_addresses.json';
import venusProtocolUnichainMainnetDeployments from '@venusprotocol/venus-protocol/deployments/unichainmainnet_addresses.json';
import venusProtocolUnichainSepoliaDeployments from '@venusprotocol/venus-protocol/deployments/unichainsepolia_addresses.json';
import venusProtocolZkSyncMainnetDeployments from '@venusprotocol/venus-protocol/deployments/zksyncmainnet_addresses.json';
import venusProtocolZkSyncSepoliaDeployments from '@venusprotocol/venus-protocol/deployments/zksyncsepolia_addresses.json';

import { ChainId } from 'types';

import type { Address } from 'viem';
import aavePoolAddressesProviderAbi from './externalAbis/AavePoolAddressesProvider.json';
import aaveUiPoolDataProviderAbi from './externalAbis/AaveUiPoolDataProvider.json';
import aaveV3PoolAbi from './externalAbis/AaveV3Pool.json';
import erc20Abi from './externalAbis/Erc20.json';

import maximillionAbi from './externalAbis/Maximillion.json';
import multicall3Abi from './externalAbis/Multicall3.json';
import nexusAbi from './externalAbis/Nexus.json';
import nexusAccountFactoryAbi from './externalAbis/NexusAccountFactory.json';
import nexusBoostrapAbi from './externalAbis/NexusBootstrap.json';
import pancakePairV2Abi from './externalAbis/PancakePairV2.json';
import swapRouterV2Abi from './externalAbis/SwapRouterV2.json';
import vBnbAbi from './externalAbis/VBnb.json';
import zyFiVaultAbi from './externalAbis/ZyFiVault.json';

export interface UniqueContractConfig {
  name: string;
  abi: Abi;
  address: Partial<{
    [chainId in ChainId]: Address;
  }>;
}

export interface GenericContractConfig {
  name: string;
  abi: Abi;
}

export interface UniquePerPoolContractConfig {
  name: string;
  abi: Abi;
  address: Partial<{
    [chainId in ChainId]: {
      [comptrollerContractAddress: Address]: Address;
    };
  }>;
}

export type ContractConfig =
  | UniqueContractConfig
  | GenericContractConfig
  | UniquePerPoolContractConfig;

export const contracts: ContractConfig[] = [
  // Unique contracts
  {
    name: 'VenusLens',
    abi: venusLensAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VenusLens as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VenusLens as Address,
    },
  },
  {
    name: 'PoolLens',
    abi: PoolLensAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: isolatedPoolsBscTestnetDeployments.addresses.PoolLens as Address,
      [ChainId.BSC_MAINNET]: isolatedPoolsBscMainnetDeployments.addresses.PoolLens as Address,
      [ChainId.ETHEREUM]: isolatedPoolsEthereumDeployments.addresses.PoolLens as Address,
      [ChainId.OPBNB_MAINNET]: isolatedPoolsOpBnbMainnetDeployments.addresses.PoolLens as Address,
      [ChainId.OPBNB_TESTNET]: isolatedPoolsOpBnbTestnetDeployments.addresses.PoolLens as Address,
      [ChainId.SEPOLIA]: isolatedPoolsSepoliaDeployments.addresses.PoolLens as Address,
      [ChainId.ARBITRUM_SEPOLIA]: isolatedPoolsArbitrumSepoliaDeployments.addresses
        .PoolLens as Address,
      [ChainId.ARBITRUM_ONE]: isolatedPoolsArbitrumOneDeployments.addresses.PoolLens as Address,
      [ChainId.ZKSYNC_SEPOLIA]: isolatedPoolsZkSyncSepoliaDeployments.addresses.PoolLens as Address,
      [ChainId.ZKSYNC_MAINNET]: isolatedPoolsZkSyncMainnetDeployments.addresses.PoolLens as Address,
      [ChainId.OPTIMISM_SEPOLIA]: isolatedPoolsOptimismSepoliaDeployments.addresses
        .PoolLens as Address,
      [ChainId.OPTIMISM_MAINNET]: isolatedPoolsOptimismMainnetDeployments.addresses
        .PoolLens as Address,
      [ChainId.BASE_MAINNET]: isolatedPoolsBaseMainnetDeployments.addresses.PoolLens as Address,
      [ChainId.BASE_SEPOLIA]: isolatedPoolsBaseSepoliaDeployments.addresses.PoolLens as Address,
      [ChainId.UNICHAIN_MAINNET]: isolatedPoolsUnichainMainnetDeployments.addresses
        .PoolLens as Address,
      [ChainId.UNICHAIN_SEPOLIA]: isolatedPoolsUnichainSepoliaDeployments.addresses
        .PoolLens as Address,
    },
  },
  {
    name: 'PoolRegistry',
    abi: PoolRegistryAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: isolatedPoolsBscTestnetDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.BSC_MAINNET]: isolatedPoolsBscMainnetDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.ETHEREUM]: isolatedPoolsEthereumDeployments.addresses.PoolRegistry_Proxy as Address,
      [ChainId.OPBNB_MAINNET]: isolatedPoolsOpBnbMainnetDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.OPBNB_TESTNET]: isolatedPoolsOpBnbTestnetDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.SEPOLIA]: isolatedPoolsSepoliaDeployments.addresses.PoolRegistry_Proxy as Address,
      [ChainId.ARBITRUM_SEPOLIA]: isolatedPoolsArbitrumSepoliaDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.ARBITRUM_ONE]: isolatedPoolsArbitrumOneDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.ZKSYNC_SEPOLIA]: isolatedPoolsZkSyncSepoliaDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.ZKSYNC_MAINNET]: isolatedPoolsZkSyncMainnetDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.OPTIMISM_SEPOLIA]: isolatedPoolsOptimismSepoliaDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.OPTIMISM_MAINNET]: isolatedPoolsOptimismMainnetDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.BASE_MAINNET]: isolatedPoolsBaseMainnetDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.BASE_SEPOLIA]: isolatedPoolsBaseSepoliaDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.UNICHAIN_MAINNET]: isolatedPoolsUnichainMainnetDeployments.addresses
        .PoolRegistry_Proxy as Address,
      [ChainId.UNICHAIN_SEPOLIA]: isolatedPoolsUnichainSepoliaDeployments.addresses
        .PoolRegistry_Proxy as Address,
    },
  },
  {
    name: 'LegacyPoolComptroller',
    abi: legacyPoolComptrollerAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.Unitroller as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.Unitroller as Address,
    },
  },
  {
    name: 'VaiController',
    abi: vaiControllerAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VaiUnitroller as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VaiUnitroller as Address,
    },
  },
  {
    name: 'VaiVault',
    abi: vaiVaultAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VAIVaultProxy as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VAIVaultProxy as Address,
    },
  },
  {
    name: 'XvsTokenOmnichain',
    abi: XvsTokenOmnichainAbi as Abi,
    address: {
      [ChainId.ETHEREUM]: tokenBridgeEthereumDeployments.addresses.XVS as Address,
      [ChainId.SEPOLIA]: tokenBridgeSepoliaDeployments.addresses.XVS as Address,
      [ChainId.OPBNB_MAINNET]: tokenBridgeOpBnbMainnetDeployments.addresses.XVS as Address,
      [ChainId.OPBNB_TESTNET]: tokenBridgeOpBnbTestnetDeployments.addresses.XVS as Address,
      [ChainId.ARBITRUM_SEPOLIA]: tokenBridgeArbitrumSepoliaDeployments.addresses.XVS as Address,
      [ChainId.ARBITRUM_ONE]: tokenBridgeArbitrumOneDeployments.addresses.XVS as Address,
      [ChainId.ZKSYNC_SEPOLIA]: tokenBridgeZkSyncSepoliaDeployments.addresses.XVS as Address,
      [ChainId.ZKSYNC_MAINNET]: tokenBridgeZkSyncMainnetDeployments.addresses.XVS as Address,
      [ChainId.OPTIMISM_SEPOLIA]: tokenBridgeOptimismSepoliaDeployments.addresses.XVS as Address,
      [ChainId.OPTIMISM_MAINNET]: tokenBridgeOptimismMainnetDeployments.addresses.XVS as Address,
      [ChainId.BASE_MAINNET]: tokenBridgeBaseMainnetDeployments.addresses.XVS as Address,
      [ChainId.BASE_SEPOLIA]: tokenBridgeBaseSepoliaDeployments.addresses.XVS as Address,
      [ChainId.UNICHAIN_MAINNET]: tokenBridgeUnichainMainnetDeployments.addresses.XVS as Address,
      [ChainId.UNICHAIN_SEPOLIA]: tokenBridgeUnichainSepoliaDeployments.addresses.XVS as Address,
    },
  },
  {
    name: 'XvsVault',
    abi: xvsVaultAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.XVSVaultProxy as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.XVSVaultProxy as Address,
      [ChainId.ETHEREUM]: venusProtocolEthereumDeployments.addresses.XVSVaultProxy as Address,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.XVSVaultProxy as Address,
      [ChainId.OPBNB_MAINNET]: venusProtocolOpBnbMainnetDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.OPBNB_TESTNET]: venusProtocolOpBnbTestnetDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.ARBITRUM_SEPOLIA]: venusProtocolArbitrumSepoliaDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.ARBITRUM_ONE]: venusProtocolArbitrumOneDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.ZKSYNC_SEPOLIA]: venusProtocolZkSyncSepoliaDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.ZKSYNC_MAINNET]: venusProtocolZkSyncMainnetDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.OPTIMISM_SEPOLIA]: venusProtocolOptimismSepoliaDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.OPTIMISM_MAINNET]: venusProtocolOptimismMainnetDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.BASE_MAINNET]: venusProtocolBaseMainnetDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.BASE_SEPOLIA]: venusProtocolBaseSepoliaDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.UNICHAIN_MAINNET]: venusProtocolUnichainMainnetDeployments.addresses
        .XVSVaultProxy as Address,
      [ChainId.UNICHAIN_SEPOLIA]: venusProtocolUnichainSepoliaDeployments.addresses
        .XVSVaultProxy as Address,
    },
  },
  {
    name: 'XvsStore',
    abi: xvsStoreAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.XVSStore as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.XVSStore as Address,
      [ChainId.ETHEREUM]: venusProtocolEthereumDeployments.addresses.XVSStore as Address,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.XVSStore as Address,
      [ChainId.OPBNB_MAINNET]: venusProtocolOpBnbMainnetDeployments.addresses.XVSStore as Address,
      [ChainId.OPBNB_TESTNET]: venusProtocolOpBnbTestnetDeployments.addresses.XVSStore as Address,
      [ChainId.ARBITRUM_SEPOLIA]: venusProtocolArbitrumSepoliaDeployments.addresses
        .XVSStore as Address,
      [ChainId.ARBITRUM_ONE]: venusProtocolArbitrumOneDeployments.addresses.XVSStore as Address,
      [ChainId.ZKSYNC_SEPOLIA]: venusProtocolZkSyncSepoliaDeployments.addresses.XVSStore as Address,
      [ChainId.ZKSYNC_MAINNET]: venusProtocolZkSyncMainnetDeployments.addresses.XVSStore as Address,
      [ChainId.OPTIMISM_SEPOLIA]: venusProtocolOptimismSepoliaDeployments.addresses
        .XVSStore as Address,
      [ChainId.OPTIMISM_MAINNET]: venusProtocolOptimismMainnetDeployments.addresses
        .XVSStore as Address,
      [ChainId.BASE_MAINNET]: venusProtocolBaseMainnetDeployments.addresses.XVSStore as Address,
      [ChainId.BASE_SEPOLIA]: venusProtocolBaseSepoliaDeployments.addresses.XVSStore as Address,
      [ChainId.UNICHAIN_MAINNET]: venusProtocolUnichainMainnetDeployments.addresses
        .XVSStore as Address,
      [ChainId.UNICHAIN_SEPOLIA]: venusProtocolUnichainSepoliaDeployments.addresses
        .XVSStore as Address,
    },
  },
  {
    name: 'GovernorBravoDelegate',
    abi: GovernorBravoDelegateAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusGovernanceBscTestnetDeployments.addresses
        .GovernorBravoDelegator_Proxy as Address,
      [ChainId.BSC_MAINNET]: venusGovernanceBscMainnetDeployments.addresses
        .GovernorBravoDelegator_Proxy as Address,
    },
  },
  {
    name: 'OmnichainGovernanceExecutor',
    abi: OmnichainGovernanceExecutorAbi as Abi,
    address: {
      [ChainId.ETHEREUM]: venusGovernanceEthereumDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.SEPOLIA]: venusGovernanceSepoliaDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.OPBNB_MAINNET]: venusGovernanceOpBnbMainnetDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.OPBNB_TESTNET]: venusGovernanceOpBnbTestnetDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.ARBITRUM_SEPOLIA]: venusGovernanceArbitrumSepoliaDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.ARBITRUM_ONE]: venusGovernanceArbitrumOneDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.ZKSYNC_SEPOLIA]: venusGovernanceZkSyncSepoliaDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.ZKSYNC_MAINNET]: venusGovernanceZkSyncMainnetDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.OPTIMISM_MAINNET]: venusGovernanceOptimismMainnetDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.OPTIMISM_SEPOLIA]: venusGovernanceOptimismSepoliaDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.BASE_MAINNET]: venusGovernanceBaseMainnetDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.BASE_SEPOLIA]: venusGovernanceBaseSepoliaDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.UNICHAIN_MAINNET]: venusGovernanceUnichainMainnetDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
      [ChainId.UNICHAIN_SEPOLIA]: venusGovernanceUnichainSepoliaDeployments.addresses
        .OmnichainGovernanceExecutor as Address,
    },
  },
  {
    name: 'XvsVesting',
    abi: xvsVestingAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses
        .XVSVestingProxy as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses
        .XVSVestingProxy as Address,
    },
  },
  {
    name: 'VrtConverter',
    abi: vrtConverterAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses
        .VRTConverterProxy as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses
        .VRTConverterProxy as Address,
    },
  },
  {
    name: 'Maximillion',
    abi: maximillionAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: '0xF3a34e06015e019D6154a0f1089f695B27122f50',
      [ChainId.BSC_MAINNET]: '0x5efA1e46F4Fd738FF721F5AebC895b970F13E8A1',
    },
  },
  {
    name: 'Multicall3',
    abi: multicall3Abi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.BSC_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.SEPOLIA]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.ETHEREUM]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.OPBNB_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.OPBNB_TESTNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.ARBITRUM_SEPOLIA]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.ARBITRUM_ONE]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.ZKSYNC_SEPOLIA]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
      [ChainId.ZKSYNC_MAINNET]: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
      [ChainId.OPTIMISM_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.OPTIMISM_SEPOLIA]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.BASE_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.BASE_SEPOLIA]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.UNICHAIN_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.UNICHAIN_SEPOLIA]: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
  {
    name: 'ResilientOracle',
    abi: ResilientOracleAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusOracleBscTestnetDeployments.addresses.ResilientOracle as Address,
      [ChainId.BSC_MAINNET]: venusOracleBscMainnetDeployments.addresses.ResilientOracle as Address,
      [ChainId.ETHEREUM]: venusOracleEthereumDeployments.addresses.ResilientOracle as Address,
      [ChainId.OPBNB_MAINNET]: venusOracleOpBnbMainnetDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.OPBNB_TESTNET]: venusOracleOpBnbTestnetDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.SEPOLIA]: venusOracleSepoliaDeployments.addresses.ResilientOracle as Address,
      [ChainId.ARBITRUM_SEPOLIA]: venusOracleArbitrumSepoliaDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.ARBITRUM_ONE]: venusOracleArbitrumOneDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.ZKSYNC_SEPOLIA]: venusOracleZkSyncSepoliaDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.ZKSYNC_MAINNET]: venusOracleZkSyncMainnetDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.OPTIMISM_SEPOLIA]: venusOracleOptimismSepoliaDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.OPTIMISM_MAINNET]: venusOracleOptimismMainnetDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.BASE_MAINNET]: venusOracleBaseMainnetDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.BASE_SEPOLIA]: venusOracleBaseSepoliaDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.UNICHAIN_MAINNET]: venusOracleUnichainMainnetDeployments.addresses
        .ResilientOracle as Address,
      [ChainId.UNICHAIN_SEPOLIA]: venusOracleUnichainSepoliaDeployments.addresses
        .ResilientOracle as Address,
    },
  },
  {
    name: 'Prime',
    abi: primeAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.Prime as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.Prime as Address,
      [ChainId.ETHEREUM]: venusProtocolEthereumDeployments.addresses.Prime as Address,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.Prime as Address,
      [ChainId.ARBITRUM_SEPOLIA]: venusProtocolArbitrumSepoliaDeployments.addresses
        .Prime as Address,
      [ChainId.ARBITRUM_ONE]: venusProtocolArbitrumOneDeployments.addresses.Prime as Address,
      [ChainId.ZKSYNC_SEPOLIA]: venusProtocolZkSyncSepoliaDeployments.addresses.Prime as Address,
      [ChainId.ZKSYNC_MAINNET]: venusProtocolZkSyncMainnetDeployments.addresses.Prime as Address,
      [ChainId.OPTIMISM_SEPOLIA]: venusProtocolOptimismSepoliaDeployments.addresses
        .Prime as Address,
      [ChainId.OPTIMISM_MAINNET]: venusProtocolOptimismMainnetDeployments.addresses
        .Prime as Address,
      [ChainId.BASE_MAINNET]: venusProtocolBaseMainnetDeployments.addresses.Prime as Address,
      [ChainId.BASE_SEPOLIA]: venusProtocolBaseSepoliaDeployments.addresses.Prime as Address,
      [ChainId.UNICHAIN_MAINNET]: venusProtocolUnichainMainnetDeployments.addresses
        .Prime as Address,
      [ChainId.UNICHAIN_SEPOLIA]: venusProtocolUnichainSepoliaDeployments.addresses
        .Prime as Address,
    },
  },
  {
    name: 'VTreasury',
    abi: vTreasuryAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VTreasury as Address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VTreasury as Address,
    },
  },
  {
    name: 'VTreasuryV8',
    abi: vTreasuryV8Abi as Abi,
    address: {
      [ChainId.ETHEREUM]: venusProtocolEthereumDeployments.addresses.VTreasuryV8 as Address,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.VTreasuryV8 as Address,
      [ChainId.OPBNB_MAINNET]: venusProtocolOpBnbMainnetDeployments.addresses
        .VTreasuryV8 as Address,
      [ChainId.OPBNB_TESTNET]: venusProtocolOpBnbTestnetDeployments.addresses
        .VTreasuryV8 as Address,
      [ChainId.ARBITRUM_SEPOLIA]: venusProtocolArbitrumSepoliaDeployments.addresses
        .VTreasuryV8 as Address,
      [ChainId.ARBITRUM_ONE]: venusProtocolArbitrumOneDeployments.addresses.VTreasuryV8 as Address,
      [ChainId.ZKSYNC_SEPOLIA]: venusProtocolZkSyncSepoliaDeployments.addresses
        .VTreasuryV8 as Address,
      [ChainId.ZKSYNC_MAINNET]: venusProtocolZkSyncMainnetDeployments.addresses
        .VTreasuryV8 as Address,
      [ChainId.OPTIMISM_SEPOLIA]: venusProtocolOptimismSepoliaDeployments.addresses
        .VTreasuryV8 as Address,
      [ChainId.OPTIMISM_MAINNET]: venusProtocolOptimismMainnetDeployments.addresses
        .VTreasuryV8 as Address,
      [ChainId.BASE_MAINNET]: venusProtocolBaseMainnetDeployments.addresses.VTreasuryV8 as Address,
      [ChainId.BASE_SEPOLIA]: venusProtocolBaseSepoliaDeployments.addresses.VTreasuryV8 as Address,
      [ChainId.UNICHAIN_MAINNET]: venusProtocolUnichainMainnetDeployments.addresses
        .VTreasuryV8 as Address,
      [ChainId.UNICHAIN_SEPOLIA]: venusProtocolUnichainSepoliaDeployments.addresses
        .VTreasuryV8 as Address,
    },
  },
  {
    name: 'XVSProxyOFTDest',
    abi: XVSProxyOFTDestAbi as Abi,
    address: {
      [ChainId.ETHEREUM]: tokenBridgeEthereumDeployments.addresses.XVSProxyOFTDest as Address,
      [ChainId.SEPOLIA]: tokenBridgeSepoliaDeployments.addresses.XVSProxyOFTDest as Address,
      [ChainId.OPBNB_MAINNET]: tokenBridgeOpBnbMainnetDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.OPBNB_TESTNET]: tokenBridgeOpBnbTestnetDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.ARBITRUM_SEPOLIA]: tokenBridgeArbitrumSepoliaDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.ARBITRUM_ONE]: tokenBridgeArbitrumOneDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.ZKSYNC_SEPOLIA]: tokenBridgeZkSyncSepoliaDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.ZKSYNC_MAINNET]: tokenBridgeZkSyncMainnetDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.OPTIMISM_SEPOLIA]: tokenBridgeOptimismSepoliaDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.OPTIMISM_MAINNET]: tokenBridgeOptimismMainnetDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.BASE_MAINNET]: tokenBridgeBaseMainnetDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.BASE_SEPOLIA]: tokenBridgeBaseSepoliaDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.UNICHAIN_MAINNET]: tokenBridgeUnichainMainnetDeployments.addresses
        .XVSProxyOFTDest as Address,
      [ChainId.UNICHAIN_SEPOLIA]: tokenBridgeUnichainSepoliaDeployments.addresses
        .XVSProxyOFTDest as Address,
    },
  },
  {
    name: 'XVSProxyOFTSrc',
    abi: XVSProxyOFTSrcAbi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: tokenBridgeBscMainnetDeployments.addresses.XVSProxyOFTSrc as Address,
      [ChainId.BSC_TESTNET]: tokenBridgeBscTestnetDeployments.addresses.XVSProxyOFTSrc as Address,
    },
  },
  {
    name: 'ZyFiVault',
    abi: zyFiVaultAbi as Abi,
    address: {
      [ChainId.ZKSYNC_MAINNET]: '0x32faBA244AB815A5cb3E09D55c941464DBe31496',
      [ChainId.ZKSYNC_SEPOLIA]: '0xbA72A10ce8496DC9C13b9eE8c35fcCD3809d3C81',
    },
  },
  {
    name: 'AaveUiPoolDataProvider',
    abi: aaveUiPoolDataProviderAbi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: '0xc0179321f0825c3e0F59Fe7Ca4E40557b97797a3',
      [ChainId.ETHEREUM]: '0x3F78BBD206e4D3c504Eb854232EdA7e47E9Fd8FC',
      [ChainId.ARBITRUM_ONE]: '0x5c5228aC8BC1528482514aF3e27E692495148717',
      [ChainId.OPTIMISM_MAINNET]: '0xE92cd6164CE7DC68e740765BC1f2a091B6CBc3e4',
      [ChainId.BASE_MAINNET]: '0x68100bD5345eA474D93577127C11F39FF8463e93',
      [ChainId.ZKSYNC_MAINNET]: '0x6fCDa2646d6E4a42b1663d219811fC96AE3A0ec8',
    },
  },
  {
    name: 'AavePoolAddressesProvider',
    abi: aavePoolAddressesProviderAbi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: '0xff75B6da14FfbbfD355Daf7a2731456b3562Ba6D',
      [ChainId.ETHEREUM]: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
      [ChainId.ARBITRUM_ONE]: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
      [ChainId.OPTIMISM_MAINNET]: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
      [ChainId.BASE_MAINNET]: '0xe20fCBdBfFC4Dd138cE8b2E6FBb6CB49777ad64D',
      [ChainId.ZKSYNC_MAINNET]: '0x2A3948BB219D6B2Fa83D64100006391a96bE6cb7',
    },
  },
  {
    name: 'AaveV3Pool',
    abi: aaveV3PoolAbi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: '0x6807dc923806fE8Fd134338EABCA509979a7e0cB',
      [ChainId.ETHEREUM]: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
      [ChainId.ARBITRUM_ONE]: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      [ChainId.OPTIMISM_MAINNET]: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      [ChainId.BASE_MAINNET]: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
      [ChainId.ZKSYNC_MAINNET]: '0x78e30497a3c7527d953c6B1E3541b021A98Ac43c',
    },
  },
  {
    name: 'NexusAccountFactory',
    abi: nexusAccountFactoryAbi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.BSC_TESTNET]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.ETHEREUM]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.SEPOLIA]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.ARBITRUM_ONE]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.ARBITRUM_SEPOLIA]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.OPTIMISM_MAINNET]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.OPTIMISM_SEPOLIA]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.BASE_MAINNET]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.BASE_SEPOLIA]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.ZKSYNC_MAINNET]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.ZKSYNC_SEPOLIA]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.OPBNB_MAINNET]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.OPBNB_TESTNET]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.UNICHAIN_MAINNET]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
      [ChainId.UNICHAIN_SEPOLIA]: '0x0000006648ED9B2B842552BE63Af870bC74af837',
    },
  },
  {
    name: 'Nexus',
    abi: nexusAbi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.BSC_TESTNET]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.ETHEREUM]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.SEPOLIA]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.ARBITRUM_ONE]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.ARBITRUM_SEPOLIA]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.OPTIMISM_MAINNET]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.OPTIMISM_SEPOLIA]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.BASE_MAINNET]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.BASE_SEPOLIA]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.ZKSYNC_MAINNET]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.ZKSYNC_SEPOLIA]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.OPBNB_MAINNET]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.OPBNB_TESTNET]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.UNICHAIN_MAINNET]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
      [ChainId.UNICHAIN_SEPOLIA]: '0x00000000383e8cBe298514674Ea60Ee1d1de50ac',
    },
  },
  {
    name: 'NexusBoostrap',
    abi: nexusBoostrapAbi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.BSC_TESTNET]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.ETHEREUM]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.SEPOLIA]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.ARBITRUM_ONE]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.ARBITRUM_SEPOLIA]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.OPTIMISM_MAINNET]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.OPTIMISM_SEPOLIA]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.BASE_MAINNET]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.BASE_SEPOLIA]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.ZKSYNC_MAINNET]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.ZKSYNC_SEPOLIA]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.OPBNB_MAINNET]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.OPBNB_TESTNET]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.UNICHAIN_MAINNET]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
      [ChainId.UNICHAIN_SEPOLIA]: '0x0000003eDf18913c01cBc482C978bBD3D6E8ffA3',
    },
  },
  {
    name: 'LeverageManager',
    abi: leverageManagerAbi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: venusPeripheryBscMainnetDeployments.addresses
        .LeverageStrategiesManager_Proxy as Address,
    },
  },
  // Generic Contracts
  {
    name: 'IsolatedPoolComptroller',
    abi: IsolatedPoolComptrollerAbi as Abi,
  },
  {
    name: 'JumpRateModel',
    abi: jumpRateModelAbi as Abi,
  },
  {
    name: 'JumpRateModelV2',
    abi: JumpRateModelV2Abi as Abi,
  },
  {
    name: 'RewardsDistributor',
    abi: RewardsDistributorAbi as Abi,
  },
  {
    name: 'VBep20',
    abi: VBep20Abi as Abi,
  },
  {
    name: 'VBnb',
    abi: vBnbAbi as Abi,
  },
  {
    name: 'Erc20',
    abi: erc20Abi as Abi,
  },
  {
    name: 'Xvs',
    abi: xvsAbi as Abi,
  },
  {
    name: 'Vai',
    abi: vaiAbi as Abi,
  },
  {
    name: 'Vrt',
    abi: vrtAbi as Abi,
  },
  {
    name: 'PancakePairV2',
    abi: pancakePairV2Abi as Abi,
  },
  // SwapRouter contract
  {
    name: 'SwapRouterV2',
    abi: swapRouterV2Abi as Abi,
    address: {
      [ChainId.BSC_MAINNET]: '0x511fa4e04d47e2d80db9fd334359740be022aa35',
    },
  },
  {
    name: 'SwapRouter',
    abi: swapRouterAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: {
        // Core pool
        [venusProtocolBscTestnetDeployments.addresses.Unitroller.toLowerCase() as Address]:
          venusProtocolBscTestnetDeployments.addresses.SwapRouterCorePool as Address,
        // Isolated pools
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_StableCoins.toLowerCase() as Address]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_StableCoins as Address,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_Tron.toLowerCase() as Address]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_Tron as Address,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_GameFi.toLowerCase() as Address]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_GameFi as Address,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_DeFi.toLowerCase() as Address]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_DeFi as Address,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_LiquidStakedBNB.toLowerCase() as Address]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_LiquidStakedBNB as Address,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_Meme.toLowerCase() as Address]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_Meme as Address,
      },
      [ChainId.BSC_MAINNET]: {
        // Core pool
        [venusProtocolBscMainnetDeployments.addresses.Unitroller.toLowerCase() as Address]:
          venusProtocolBscMainnetDeployments.addresses.SwapRouterCorePool as Address,
        // Isolated Pools
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_Stablecoins.toLowerCase() as Address]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_Stablecoins as Address,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_Tron.toLowerCase() as Address]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_Tron as Address,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_GameFi.toLowerCase() as Address]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_GameFi as Address,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_DeFi.toLowerCase()]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_DeFi as Address,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_LiquidStakedBNB.toLowerCase() as Address]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_LiquidStakedBNB as Address,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_Meme.toLowerCase() as Address]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_Meme as Address,
      },
      [ChainId.OPBNB_MAINNET]: {},
      [ChainId.OPBNB_TESTNET]: {},
      [ChainId.ETHEREUM]: {},
      [ChainId.SEPOLIA]: {},
      [ChainId.ARBITRUM_SEPOLIA]: {},
      [ChainId.ARBITRUM_ONE]: {},
      [ChainId.ZKSYNC_SEPOLIA]: {},
      [ChainId.ZKSYNC_MAINNET]: {},
      [ChainId.OPTIMISM_MAINNET]: {},
      [ChainId.OPTIMISM_SEPOLIA]: {},
      [ChainId.BASE_MAINNET]: {},
      [ChainId.BASE_SEPOLIA]: {},
      [ChainId.UNICHAIN_MAINNET]: {},
      [ChainId.UNICHAIN_SEPOLIA]: {},
    },
  },
  // NativeTokenGateway contract addresses for each supported pool
  {
    name: 'NativeTokenGateway',
    abi: NativeTokenGatewayAbi as Abi,
    address: {
      [ChainId.BSC_TESTNET]: {
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_LiquidStakedBNB.toLowerCase() as Address]:
          isolatedPoolsBscTestnetDeployments.addresses
            .NativeTokenGateway_vWBNB_LiquidStakedBNB as Address,
        [venusProtocolBscTestnetDeployments.addresses.Unitroller_Proxy.toLowerCase() as Address]:
          '0xF34AAfc540Adc827A84736553BD29DE87a117558', // TODO: get from venus-periphery package,
      },
      [ChainId.BSC_MAINNET]: {
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_LiquidStakedBNB.toLowerCase() as Address]:
          isolatedPoolsBscMainnetDeployments.addresses
            .NativeTokenGateway_vWBNB_LiquidStakedBNB as Address,
        [venusProtocolBscMainnetDeployments.addresses.Unitroller_Proxy.toLowerCase() as Address]:
          '0x5143eb18aA057Cd8BC9734cCfD2651823e71585f', // TODO: get from venus-periphery package,
      },
      [ChainId.OPBNB_MAINNET]: {
        [isolatedPoolsOpBnbMainnetDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsOpBnbMainnetDeployments.addresses.NativeTokenGateway_vWBNB_Core as Address,
      },
      [ChainId.OPBNB_TESTNET]: {
        [isolatedPoolsOpBnbTestnetDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsOpBnbTestnetDeployments.addresses.NativeTokenGateway_vWBNB_Core as Address,
      },
      [ChainId.ETHEREUM]: {
        [isolatedPoolsEthereumDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsEthereumDeployments.addresses.NativeTokenGateway_vWETH_Core as Address,
        [isolatedPoolsEthereumDeployments.addresses[
          'Comptroller_Liquid Staked ETH'
        ].toLowerCase() as Address]: isolatedPoolsEthereumDeployments.addresses
          .NativeTokenGateway_vWETH_LiquidStakedETH as Address,
      },
      [ChainId.SEPOLIA]: {
        [isolatedPoolsSepoliaDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsSepoliaDeployments.addresses.NativeTokenGateway_vWETH_Core as Address,
        [isolatedPoolsSepoliaDeployments.addresses[
          'Comptroller_Liquid Staked ETH'
        ].toLowerCase() as Address]: isolatedPoolsSepoliaDeployments.addresses
          .NativeTokenGateway_vWETH_LiquidStakedETH as Address,
      },
      [ChainId.ARBITRUM_SEPOLIA]: {
        [isolatedPoolsArbitrumSepoliaDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsArbitrumSepoliaDeployments.addresses
            .NativeTokenGateway_vWETH_Core as Address,
        [isolatedPoolsArbitrumSepoliaDeployments.addresses[
          'Comptroller_Liquid Staked ETH'
        ].toLowerCase() as Address]: isolatedPoolsArbitrumSepoliaDeployments.addresses
          .NativeTokenGateway_vWETH_LiquidStakedETH as Address,
      },
      [ChainId.ARBITRUM_ONE]: {
        [isolatedPoolsArbitrumOneDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsArbitrumOneDeployments.addresses.NativeTokenGateway_vWETH_Core as Address,
        [isolatedPoolsArbitrumOneDeployments.addresses[
          'Comptroller_Liquid Staked ETH'
        ].toLowerCase() as Address]: isolatedPoolsArbitrumOneDeployments.addresses
          .NativeTokenGateway_vWETH_LiquidStakedETH as Address,
      },
      [ChainId.ZKSYNC_SEPOLIA]: {
        [isolatedPoolsZkSyncSepoliaDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsZkSyncSepoliaDeployments.addresses.NativeTokenGateway_vWETH_Core as Address,
      },
      [ChainId.ZKSYNC_MAINNET]: {
        [isolatedPoolsZkSyncMainnetDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsZkSyncMainnetDeployments.addresses.NativeTokenGateway_vWETH_Core as Address,
      },
      [ChainId.OPTIMISM_MAINNET]: {
        [isolatedPoolsOptimismMainnetDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsOptimismMainnetDeployments.addresses
            .NativeTokenGateway_vWETH_Core as Address,
      },
      [ChainId.OPTIMISM_SEPOLIA]: {
        [isolatedPoolsOptimismSepoliaDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsOptimismSepoliaDeployments.addresses
            .NativeTokenGateway_vWETH_Core as Address,
      },
      [ChainId.BASE_MAINNET]: {
        [isolatedPoolsBaseMainnetDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsBaseMainnetDeployments.addresses.NativeTokenGateway_vWETH_Core as Address,
      },
      [ChainId.BASE_SEPOLIA]: {
        [isolatedPoolsBaseSepoliaDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsBaseSepoliaDeployments.addresses.NativeTokenGateway_vWETH_Core as Address,
      },
      [ChainId.UNICHAIN_MAINNET]: {
        [isolatedPoolsUnichainMainnetDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsUnichainMainnetDeployments.addresses
            .NativeTokenGateway_vWETH_Core as Address,
      },
      [ChainId.UNICHAIN_SEPOLIA]: {
        [isolatedPoolsUnichainSepoliaDeployments.addresses.Comptroller_Core.toLowerCase() as Address]:
          isolatedPoolsUnichainSepoliaDeployments.addresses
            .NativeTokenGateway_vWETH_Core as Address,
      },
    },
  },
];

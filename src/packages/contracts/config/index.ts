/* eslint-disable import/no-extraneous-dependencies */
import { abi as GovernorBravoDelegateAbi } from '@venusprotocol/governance-contracts/artifacts/contracts/Governance/GovernorBravoDelegate.sol/GovernorBravoDelegate.json';
import venusGovernanceBscMainnetDeployments from '@venusprotocol/governance-contracts/deployments/bscmainnet_addresses.json';
import venusGovernanceBscTestnetDeployments from '@venusprotocol/governance-contracts/deployments/bsctestnet_addresses.json';
import { abi as IsolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as JumpRateModelV2Abi } from '@venusprotocol/isolated-pools/artifacts/contracts/JumpRateModelV2.sol/JumpRateModelV2.json';
import { abi as PoolLensAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Lens/PoolLens.sol/PoolLens.json';
import { abi as PoolRegistryAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Pool/PoolRegistry.sol/PoolRegistry.json';
import { abi as RewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { abi as VBep20Abi } from '@venusprotocol/isolated-pools/artifacts/contracts/VToken.sol/VToken.json';
import isolatedPoolsBscMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet_addresses.json';
import isolatedPoolsBscTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet_addresses.json';
import isolatedPoolsSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/sepolia_addresses.json';
import { abi as ResilientOracleAbi } from '@venusprotocol/oracle/artifacts/contracts/ResilientOracle.sol/ResilientOracle.json';
import venusOracleBscMainnetDeployments from '@venusprotocol/oracle/deployments/bscmainnet_addresses.json';
import venusOracleBscTestnetDeployments from '@venusprotocol/oracle/deployments/bsctestnet_addresses.json';
import venusOracleSepoliaDeployments from '@venusprotocol/oracle/deployments/sepolia_addresses.json';
import { abi as LegacyPoolComptrollerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Comptroller/Diamond/DiamondConsolidated.sol/DiamondConsolidated.json';
import { abi as JumpRateModelAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/InterestRateModels/JumpRateModel.sol/JumpRateModel.json';
import { abi as VenusLensAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Lens/VenusLens.sol/VenusLens.json';
import { abi as SwapRouterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Swap/SwapRouter.sol/SwapRouter.json';
import { abi as Bep20Abi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/BEP20Interface.sol/BEP20Interface.json';
import { abi as PrimeAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/Prime/Prime.sol/Prime.json';
import { abi as VaiAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VAI/VAI.sol/VAI.json';
import { abi as VaiControllerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VAI/VAIController.sol/VAIController.json';
import { abi as VrtAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VRT/VRT.sol/VRT.json';
import { abi as VrtConverterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VRT/VRTConverter.sol/VRTConverter.json';
import { abi as XvsAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/XVS/XVS.sol/XVS.json';
import { abi as XvsVestingAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/XVS/XVSVesting.sol/XVSVesting.json';
import { abi as VaiVaultAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/VAIVault/VAIVault.sol/VAIVault.json';
import { abi as XvsStoreAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/XVSVault/XVSStore.sol/XVSStore.json';
import { abi as XvsVaultAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/XVSVault/XVSVault.sol/XVSVault.json';
import venusProtocolBscMainnetDeployments from '@venusprotocol/venus-protocol/deployments/bscmainnet_addresses.json';
import venusProtocolBscTestnetDeployments from '@venusprotocol/venus-protocol/deployments/bsctestnet_addresses.json';
import venusProtocolSepoliaDeployments from '@venusprotocol/venus-protocol/deployments/sepolia_addresses.json';
import { type ContractInterface } from 'ethers';

import { ChainId } from 'types';

import MaximillionAbi from './externalAbis/Maximillion.json';
import multicall3Abi from './externalAbis/Multicall3.json';
import pancakePairV2Abi from './externalAbis/PancakePairV2.json';
import vBnbAbi from './externalAbis/VBnb.json';
import XsequenceMulticall from './externalAbis/XsequenceMulticall.json';

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
    abi: VenusLensAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VenusLens,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VenusLens,
    },
  },
  {
    name: 'PoolLens',
    abi: PoolLensAbi,
    address: {
      [ChainId.BSC_TESTNET]: isolatedPoolsBscTestnetDeployments.addresses.PoolLens,
      [ChainId.BSC_MAINNET]: isolatedPoolsBscMainnetDeployments.addresses.PoolLens,
      [ChainId.SEPOLIA]: isolatedPoolsSepoliaDeployments.addresses.PoolLens,
    },
  },
  {
    name: 'PoolRegistry',
    abi: PoolRegistryAbi,
    address: {
      [ChainId.BSC_TESTNET]: isolatedPoolsBscTestnetDeployments.addresses.PoolRegistry_Proxy,
      [ChainId.BSC_MAINNET]: isolatedPoolsBscMainnetDeployments.addresses.PoolRegistry_Proxy,
      [ChainId.SEPOLIA]: isolatedPoolsSepoliaDeployments.addresses.PoolRegistry_Proxy,
    },
  },
  {
    name: 'LegacyPoolComptroller',
    abi: LegacyPoolComptrollerAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.Unitroller,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.Unitroller,
      [ChainId.SEPOLIA]: isolatedPoolsSepoliaDeployments.addresses.Comptroller_Core,
    },
  },
  {
    name: 'VaiController',
    abi: VaiControllerAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VaiUnitroller,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VaiUnitroller,
    },
  },
  {
    name: 'VaiVault',
    abi: VaiVaultAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VAIVaultProxy,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VAIVaultProxy,
    },
  },
  {
    name: 'XvsVault',
    abi: XvsVaultAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.XVSVaultProxy,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.XVSVaultProxy,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.XVSVaultProxy,
    },
  },
  {
    name: 'XvsStore',
    abi: XvsStoreAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.XVSStore,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.XVSStore,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.XVSStore,
    },
  },
  {
    name: 'GovernorBravoDelegate',
    abi: GovernorBravoDelegateAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusGovernanceBscTestnetDeployments.addresses.GovernorBravoDelegate,
      [ChainId.BSC_MAINNET]: venusGovernanceBscMainnetDeployments.addresses.GovernorBravoDelegate,
    },
  },
  {
    name: 'XvsVesting',
    abi: XvsVestingAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.XVSVestingProxy,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.XVSVestingProxy,
    },
  },
  {
    name: 'VrtConverter',
    abi: VrtConverterAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VRTConverterProxy,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VRTConverterProxy,
    },
  },
  {
    name: 'Maximillion',
    abi: MaximillionAbi,
    address: {
      [ChainId.BSC_TESTNET]: '0xF3a34e06015e019D6154a0f1089f695B27122f50',
      [ChainId.BSC_MAINNET]: '0x5efA1e46F4Fd738FF721F5AebC895b970F13E8A1',
    },
  },
  {
    name: 'XsequenceMulticall',
    abi: XsequenceMulticall,
    address: {
      [ChainId.BSC_MAINNET]: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
      [ChainId.BSC_TESTNET]: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
      [ChainId.ETHEREUM]: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
      [ChainId.SEPOLIA]: '0xd130B43062D875a4B7aF3f8fc036Bc6e9D3E1B3E',
    },
  },
  {
    name: 'Multicall3',
    abi: multicall3Abi,
    address: {
      [ChainId.BSC_TESTNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.BSC_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
  {
    name: 'ResilientOracle',
    abi: ResilientOracleAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusOracleBscTestnetDeployments.addresses.ResilientOracle,
      [ChainId.BSC_MAINNET]: venusOracleBscMainnetDeployments.addresses.ResilientOracle,
      [ChainId.SEPOLIA]: venusOracleSepoliaDeployments.addresses.ResilientOracle,
    },
  },
  {
    name: 'Prime',
    abi: PrimeAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.Prime,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.Prime,
    },
  },
  // Generic Contracts
  {
    name: 'IsolatedPoolComptroller',
    abi: IsolatedPoolComptrollerAbi,
  },
  {
    name: 'JumpRateModel',
    abi: JumpRateModelAbi,
  },
  {
    name: 'JumpRateModelV2',
    abi: JumpRateModelV2Abi,
  },
  {
    name: 'RewardsDistributor',
    abi: RewardsDistributorAbi,
  },
  {
    name: 'VBep20',
    abi: VBep20Abi,
  },
  {
    name: 'VBnb',
    abi: vBnbAbi,
  },
  {
    name: 'Bep20',
    abi: Bep20Abi,
  },
  {
    name: 'Xvs',
    abi: XvsAbi,
  },
  {
    name: 'Vai',
    abi: VaiAbi,
  },
  {
    name: 'Vrt',
    abi: VrtAbi,
  },
  {
    name: 'PancakePairV2',
    abi: pancakePairV2Abi,
  },
  // SwapRouter contract
  {
    name: 'SwapRouter',
    abi: SwapRouterAbi,
    address: {
      [ChainId.BSC_TESTNET]: {
        // Core pool
        [venusProtocolBscTestnetDeployments.addresses.Unitroller.toLowerCase()]:
          venusProtocolBscTestnetDeployments.addresses.SwapRouterCorePool,
        // Isolated pools
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_StableCoins.toLowerCase()]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_StableCoins,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_Tron.toLowerCase()]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_Tron,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_GameFi.toLowerCase()]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_GameFi,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_DeFi.toLowerCase()]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_DeFi,
        [isolatedPoolsBscTestnetDeployments.addresses.Comptroller_LiquidStakedBNB.toLowerCase()]:
          isolatedPoolsBscTestnetDeployments.addresses.SwapRouter_LiquidStakedBNB,
      },
      [ChainId.BSC_MAINNET]: {
        // Core pool
        [venusProtocolBscMainnetDeployments.addresses.Unitroller.toLowerCase()]:
          venusProtocolBscMainnetDeployments.addresses.SwapRouterCorePool,
        // Isolated Pools
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_Stablecoins.toLowerCase()]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_Stablecoins,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_Tron.toLowerCase()]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_Tron,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_GameFi.toLowerCase()]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_GameFi,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_DeFi.toLowerCase()]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_DeFi,
        [isolatedPoolsBscMainnetDeployments.addresses.Comptroller_LiquidStakedBNB.toLowerCase()]:
          isolatedPoolsBscMainnetDeployments.addresses.SwapRouter_LiquidStakedBNB,
      },
      [ChainId.ETHEREUM]: {},
      [ChainId.SEPOLIA]: {},
    },
  },
];

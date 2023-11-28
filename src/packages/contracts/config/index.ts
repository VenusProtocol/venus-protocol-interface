/* eslint-disable import/no-extraneous-dependencies */
import { abi as GovernorBravoDelegateAbi } from '@venusprotocol/governance-contracts/artifacts/contracts/Governance/GovernorBravoDelegate.sol/GovernorBravoDelegate.json';
import venusGovernanceBscMainnetDeployments from '@venusprotocol/governance-contracts/deployments/bscmainnet.json';
import venusGovernanceBscTestnetDeployments from '@venusprotocol/governance-contracts/deployments/bsctestnet.json';
import { abi as IsolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as JumpRateModelV2Abi } from '@venusprotocol/isolated-pools/artifacts/contracts/JumpRateModelV2.sol/JumpRateModelV2.json';
import { abi as PoolLensAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Lens/PoolLens.sol/PoolLens.json';
import { abi as PoolRegistryAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Pool/PoolRegistry.sol/PoolRegistry.json';
import { abi as RewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { abi as VBep20Abi } from '@venusprotocol/isolated-pools/artifacts/contracts/VToken.sol/VToken.json';
import isolatedPoolsMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet.json';
import isolatedPoolsTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import { abi as ResilientOracleAbi } from '@venusprotocol/oracle/artifacts/contracts/ResilientOracle.sol/ResilientOracle.json';
import venusOracleBscMainnetDeployments from '@venusprotocol/oracle/deployments/bscmainnet.json';
import venusOracleBscTestnetDeployments from '@venusprotocol/oracle/deployments/bsctestnet.json';
import venusOracleSepoliaDeployments from '@venusprotocol/oracle/deployments/sepolia.json';
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
import venusProtocolBscMainnetDeployments from '@venusprotocol/venus-protocol/deployments/bscmainnet.json';
import venusProtocolBscTestnetDeployments from '@venusprotocol/venus-protocol/deployments/bsctestnet.json';
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
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.VenusLens.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.VenusLens.address,
    },
  },
  {
    name: 'PoolLens',
    abi: PoolLensAbi,
    address: {
      [ChainId.BSC_TESTNET]: isolatedPoolsTestnetDeployments.contracts.PoolLens.address,
      [ChainId.BSC_MAINNET]: isolatedPoolsMainnetDeployments.contracts.PoolLens.address,
    },
  },
  {
    name: 'PoolRegistry',
    abi: PoolRegistryAbi,
    address: {
      [ChainId.BSC_TESTNET]: isolatedPoolsTestnetDeployments.contracts.PoolRegistry_Proxy.address,
      [ChainId.BSC_MAINNET]: isolatedPoolsMainnetDeployments.contracts.PoolRegistry_Proxy.address,
    },
  },
  {
    name: 'LegacyPoolComptroller',
    abi: LegacyPoolComptrollerAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.Unitroller.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.Unitroller.address,
    },
  },
  {
    name: 'VaiController',
    abi: VaiControllerAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.VaiUnitroller.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.VaiUnitroller.address,
    },
  },
  {
    name: 'VaiVault',
    abi: VaiVaultAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.VAIVaultProxy.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.VAIVaultProxy.address,
    },
  },
  {
    name: 'XvsVault',
    abi: XvsVaultAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.XVSVaultProxy.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.XVSVaultProxy.address,
    },
  },
  {
    name: 'XvsStore',
    abi: XvsStoreAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.XVSStore.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.XVSStore.address,
    },
  },
  {
    name: 'GovernorBravoDelegate',
    abi: GovernorBravoDelegateAbi,
    address: {
      [ChainId.BSC_TESTNET]:
        venusGovernanceBscTestnetDeployments.contracts.GovernorBravoDelegate.address,
      [ChainId.BSC_MAINNET]:
        venusGovernanceBscMainnetDeployments.contracts.GovernorBravoDelegate.address,
    },
  },
  {
    name: 'XvsVesting',
    abi: XvsVestingAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.XVSVestingProxy.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.XVSVestingProxy.address,
    },
  },
  {
    name: 'VrtConverter',
    abi: VrtConverterAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.VRTConverterProxy.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.VRTConverterProxy.address,
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
      [ChainId.BSC_TESTNET]: venusOracleBscTestnetDeployments.contracts.ResilientOracle.address,
      [ChainId.BSC_MAINNET]: venusOracleBscMainnetDeployments.contracts.ResilientOracle.address,
      [ChainId.SEPOLIA]: venusOracleSepoliaDeployments.contracts.ResilientOracle.address,
    },
  },
  {
    name: 'Prime',
    abi: PrimeAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.contracts.Prime.address,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.contracts.Prime.address,
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
        [venusProtocolBscTestnetDeployments.contracts.Unitroller.address.toLowerCase()]:
          venusProtocolBscTestnetDeployments.contracts.SwapRouterCorePool.address,
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
        // Core pool
        [venusProtocolBscMainnetDeployments.contracts.Unitroller.address.toLowerCase()]:
          venusProtocolBscMainnetDeployments.contracts.SwapRouterCorePool.address,
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
      [ChainId.ETHEREUM]: {},
      [ChainId.SEPOLIA]: {},
    },
  },
];

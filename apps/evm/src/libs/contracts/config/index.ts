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
import isolatedPoolsEthereumDeployments from '@venusprotocol/isolated-pools/deployments/ethereum_addresses.json';
import isolatedPoolsOpBnbTestnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbtestnet_addresses.json';
import isolatedPoolsSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/sepolia_addresses.json';
import { abi as ResilientOracleAbi } from '@venusprotocol/oracle/artifacts/contracts/ResilientOracle.sol/ResilientOracle.json';
import venusOracleBscMainnetDeployments from '@venusprotocol/oracle/deployments/bscmainnet_addresses.json';
import venusOracleBscTestnetDeployments from '@venusprotocol/oracle/deployments/bsctestnet_addresses.json';
import venusOracleEthereumDeployments from '@venusprotocol/oracle/deployments/ethereum_addresses.json';
import venusOracleSepoliaDeployments from '@venusprotocol/oracle/deployments/sepolia_addresses.json';
import { abi as XVSProxyOFTDest } from '@venusprotocol/token-bridge/artifacts/contracts/Bridge/XVSProxyOFTDest.sol/XVSProxyOFTDest.json';
import { abi as XVSProxyOFTSrc } from '@venusprotocol/token-bridge/artifacts/contracts/Bridge/XVSProxyOFTSrc.sol/XVSProxyOFTSrc.json';
import { abi as XvsTokenMultichainAbi } from '@venusprotocol/token-bridge/artifacts/contracts/Bridge/token/XVS.sol/XVS.json';
import tokenBridgeBscMainnetDeployments from '@venusprotocol/token-bridge/deployments/bscmainnet_addresses.json';
import tokenBridgeBscTestnetDeployments from '@venusprotocol/token-bridge/deployments/bsctestnet_addresses.json';
import tokenBridgeEthereumDeployments from '@venusprotocol/token-bridge/deployments/ethereum_addresses.json';
import tokenBridgeOpBnbTestnetDeployments from '@venusprotocol/token-bridge/deployments/opbnbtestnet_addresses.json';
import tokenBridgeSepoliaDeployments from '@venusprotocol/token-bridge/deployments/sepolia_addresses.json';
import { abi as LegacyPoolComptrollerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Comptroller/Diamond/DiamondConsolidated.sol/DiamondConsolidated.json';
import { abi as VTreasuryAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Governance/VTreasury.sol/VTreasury.json';
import { abi as VTreasuryV8Abi } from '@venusprotocol/venus-protocol/artifacts/contracts/Governance/VTreasuryV8.sol/VTreasuryV8.json';
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
import venusProtocolEthereumDeployments from '@venusprotocol/venus-protocol/deployments/ethereum_addresses.json';
import venusProtocolOpBnbTestnetDeployments from '@venusprotocol/venus-protocol/deployments/opbnbtestnet_addresses.json';
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
      [ChainId.ETHEREUM]: isolatedPoolsEthereumDeployments.addresses.PoolLens,
      [ChainId.OPBNB_TESTNET]: isolatedPoolsOpBnbTestnetDeployments.addresses.PoolLens,
      [ChainId.SEPOLIA]: isolatedPoolsSepoliaDeployments.addresses.PoolLens,
    },
  },
  {
    name: 'PoolRegistry',
    abi: PoolRegistryAbi,
    address: {
      [ChainId.BSC_TESTNET]: isolatedPoolsBscTestnetDeployments.addresses.PoolRegistry_Proxy,
      [ChainId.BSC_MAINNET]: isolatedPoolsBscMainnetDeployments.addresses.PoolRegistry_Proxy,
      [ChainId.ETHEREUM]: isolatedPoolsEthereumDeployments.addresses.PoolRegistry_Proxy,
      [ChainId.OPBNB_TESTNET]: isolatedPoolsOpBnbTestnetDeployments.addresses.PoolRegistry_Proxy,
      [ChainId.SEPOLIA]: isolatedPoolsSepoliaDeployments.addresses.PoolRegistry_Proxy,
    },
  },
  {
    name: 'LegacyPoolComptroller',
    abi: LegacyPoolComptrollerAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.Unitroller,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.Unitroller,
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
    name: 'XvsTokenMultichain',
    abi: XvsTokenMultichainAbi,
    address: {
      [ChainId.ETHEREUM]: tokenBridgeEthereumDeployments.addresses.XVS,
      [ChainId.SEPOLIA]: tokenBridgeSepoliaDeployments.addresses.XVS,
      [ChainId.OPBNB_MAINNET]: '0x3E2e61F1c075881F3fB8dd568043d8c221fd5c61', // TODO: replace once added to the token-bridge package
      [ChainId.OPBNB_TESTNET]: tokenBridgeOpBnbTestnetDeployments.addresses.XVS,
    },
  },
  {
    name: 'XvsVault',
    abi: XvsVaultAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.XVSVaultProxy,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.XVSVaultProxy,
      [ChainId.ETHEREUM]: venusProtocolEthereumDeployments.addresses.XVSVaultProxy,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.XVSVaultProxy,
      [ChainId.OPBNB_MAINNET]: '0x7dc969122450749A8B0777c0e324522d67737988', // TODO: replace once added to the venus-protocol package
      [ChainId.OPBNB_TESTNET]: venusProtocolOpBnbTestnetDeployments.addresses.XVSVaultProxy,
    },
  },
  {
    name: 'XvsStore',
    abi: XvsStoreAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.XVSStore,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.XVSStore,
      [ChainId.ETHEREUM]: venusProtocolEthereumDeployments.addresses.XVSStore,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.XVSStore,
      [ChainId.OPBNB_TESTNET]: venusProtocolOpBnbTestnetDeployments.addresses.XVSVaultProxy,
    },
  },
  {
    name: 'GovernorBravoDelegate',
    abi: GovernorBravoDelegateAbi,
    address: {
      [ChainId.BSC_TESTNET]:
        venusGovernanceBscTestnetDeployments.addresses.GovernorBravoDelegator_Proxy,
      [ChainId.BSC_MAINNET]:
        venusGovernanceBscMainnetDeployments.addresses.GovernorBravoDelegator_Proxy,
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
      [ChainId.OPBNB_MAINNET]: '0x3E5f527Adf40B65Fcbb4918e6507ecB89AF7Cdf5',
      [ChainId.OPBNB_TESTNET]: '0x34D4c29902769a0168b9965CbC4147771206328D',
    },
  },
  {
    name: 'Multicall3',
    abi: multicall3Abi,
    address: {
      [ChainId.BSC_TESTNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.BSC_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.SEPOLIA]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.OPBNB_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
      [ChainId.OPBNB_TESTNET]: '0xca11bde05977b3631167028862be2a173976ca11',
    },
  },
  {
    name: 'ResilientOracle',
    abi: ResilientOracleAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusOracleBscTestnetDeployments.addresses.ResilientOracle,
      [ChainId.BSC_MAINNET]: venusOracleBscMainnetDeployments.addresses.ResilientOracle,
      [ChainId.ETHEREUM]: venusOracleEthereumDeployments.addresses.ResilientOracle,
      [ChainId.OPBNB_MAINNET]: '0x8f3618c4F0183e14A218782c116fb2438571dAC9', // TODO: replace once added to the oracle package
      [ChainId.OPBNB_TESTNET]: venusOracleEthereumDeployments.addresses.ResilientOracle,
      [ChainId.SEPOLIA]: venusOracleSepoliaDeployments.addresses.ResilientOracle,
    },
  },
  {
    name: 'Prime',
    abi: PrimeAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.Prime,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.Prime,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.Prime,
    },
  },
  {
    name: 'VTreasury',
    abi: VTreasuryAbi,
    address: {
      [ChainId.BSC_TESTNET]: venusProtocolBscTestnetDeployments.addresses.VTreasury,
      [ChainId.BSC_MAINNET]: venusProtocolBscMainnetDeployments.addresses.VTreasury,
    },
  },
  {
    name: 'VTreasuryV8',
    abi: VTreasuryV8Abi,
    address: {
      [ChainId.ETHEREUM]: venusProtocolEthereumDeployments.addresses.VTreasuryV8,
      [ChainId.SEPOLIA]: venusProtocolSepoliaDeployments.addresses.VTreasuryV8,
      [ChainId.OPBNB_TESTNET]: venusProtocolOpBnbTestnetDeployments.addresses.VTreasuryV8,
    },
  },
  {
    name: 'XVSProxyOFTDest',
    abi: XVSProxyOFTDest,
    address: {
      [ChainId.ETHEREUM]: tokenBridgeEthereumDeployments.addresses.XVSProxyOFTDest,
      [ChainId.SEPOLIA]: tokenBridgeSepoliaDeployments.addresses.XVSProxyOFTDest,
      [ChainId.OPBNB_MAINNET]: '0x100D331C1B5Dcd41eACB1eCeD0e83DCEbf3498B2', // TODO: replace once added to the token bridge package
      [ChainId.OPBNB_TESTNET]: tokenBridgeOpBnbTestnetDeployments.addresses.XVSProxyOFTDest,
    },
  },
  {
    name: 'XVSProxyOFTSrc',
    abi: XVSProxyOFTSrc,
    address: {
      [ChainId.BSC_MAINNET]: tokenBridgeBscMainnetDeployments.addresses.XVSProxyOFTSrc,
      [ChainId.BSC_TESTNET]: tokenBridgeBscTestnetDeployments.addresses.XVSProxyOFTSrc,
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
      [ChainId.OPBNB_MAINNET]: {},
      [ChainId.OPBNB_TESTNET]: {},
      [ChainId.ETHEREUM]: {},
      [ChainId.SEPOLIA]: {},
    },
  },
];

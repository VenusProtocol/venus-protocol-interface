import type { JsonFragment } from '@ethersproject/abi';
import { abi as poolLensAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Lens/PoolLens.sol/PoolLens.json';
import { abi as poolRegistryAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Pool/PoolRegistry.sol/PoolRegistry.json';
import isolatedPoolsMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet.json';
import isolatedPoolsTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import { abi as resilientOracleAbi } from '@venusprotocol/oracle/artifacts/contracts/ResilientOracle.sol/ResilientOracle.json';
import resilientOracleMainnetDeployments from '@venusprotocol/oracle/deployments/bscmainnet/ResilientOracle.json';
import resilientOracleTestnetDeployments from '@venusprotocol/oracle/deployments/bsctestnet/ResilientOracle.json';
import { abi as mainPoolComptrollerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Comptroller/Comptroller.sol/Comptroller.json';
import { abi as governorBravoDelegateAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Governance/GovernorBravoDelegate.sol/GovernorBravoDelegate.json';
import { abi as venusLensAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Lens/VenusLens.sol/VenusLens.json';
import { abi as vaiControllerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VAI/VAIController.sol/VAIController.json';
import { abi as vrtConverterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VRT/VRTConverter.sol/VRTConverter.json';
import { abi as xvsVestingAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/XVS/XVSVesting.sol/XVSVesting.json';
import { abi as vaiVaultAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Vault/VAIVault.sol/VAIVault.json';
import { abi as xvsStoreAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/XVSVault/XVSStore.sol/XVSStore.json';
import { abi as xvsVaultAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/XVSVault/XVSVault.sol/XVSVault.json';
import venusProtocolMainnetDeployments from '@venusprotocol/venus-protocol/networks/mainnet.json';
import venusProtocolTestnetDeployments from '@venusprotocol/venus-protocol/networks/testnet.json';

import { PoolLens, PoolRegistry } from '../types/contracts/isolatedPools';
import { ResilientOracle } from '../types/contracts/oracle';
import { Maximillion, Multicall } from '../types/contracts/others';
import {
  GovernorBravoDelegate,
  Comptroller as MainPoolComptroller,
  VAIController,
  VAIVault,
  VRTConverter,
  VenusLens,
  XVSStore,
  XVSVault,
} from '../types/contracts/venusProtocol';
import { XVSVesting } from '../types/contracts/xvsVesting';

import { ChainId } from '../types';
import maximillionAbi from './externalAbis/maximillion.json';
import multicallAbi from './externalAbis/multicall.json';

export interface UniqueContractInfo {
  abi: JsonFragment[];
  address: Partial<{
    [chainId in ChainId]: string;
  }>;
}

const venusLens: UniqueContractInfo = {
  abi: venusLensAbi,
  address: {
    // TODO: get address from package once it's been updated
    [ChainId.BSC_TESTNET]: '0x11c8dC3DcA87E8205ec01e6d79Be9442d31701d3',
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VenusLens,
  },
};

const poolLens: UniqueContractInfo = {
  abi: poolLensAbi,
  address: {
    [ChainId.BSC_TESTNET]: isolatedPoolsTestnetDeployments.contracts.PoolLens.address,
    [ChainId.BSC_MAINNET]: isolatedPoolsMainnetDeployments.contracts.PoolLens.address,
  },
};

const poolRegistry: UniqueContractInfo = {
  abi: poolRegistryAbi,
  address: {
    [ChainId.BSC_TESTNET]: isolatedPoolsTestnetDeployments.contracts.PoolRegistry_Proxy.address,
    [ChainId.BSC_MAINNET]: isolatedPoolsMainnetDeployments.contracts.PoolRegistry_Proxy.address,
  },
};

const mainPoolComptroller: UniqueContractInfo = {
  abi: mainPoolComptrollerAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.Unitroller,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.Unitroller,
  },
};

const vaiController: UniqueContractInfo = {
  abi: vaiControllerAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.VaiUnitroller,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VaiUnitroller,
  },
};

const vaiVault: UniqueContractInfo = {
  abi: vaiVaultAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.VAIVaultProxy,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VAIVaultProxy,
  },
};

const xvsVault: UniqueContractInfo = {
  abi: xvsVaultAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.XVSVaultProxy,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.XVSVaultProxy,
  },
};

const xvsStore: UniqueContractInfo = {
  abi: xvsStoreAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.XVSStore,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.XVSStore,
  },
};

const governorBravoDelegate: UniqueContractInfo = {
  abi: governorBravoDelegateAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.GovernorBravoDelegator,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.GovernorBravoDelegator,
  },
};

const xvsVesting: UniqueContractInfo = {
  abi: xvsVestingAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.XVSVestingProxy,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.XVSVestingProxy,
  },
};

const vrtConverter: UniqueContractInfo = {
  abi: vrtConverterAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.VRTConverterProxy,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VRTConverterProxy,
  },
};

const maximillion: UniqueContractInfo = {
  abi: maximillionAbi,
  address: {
    [ChainId.BSC_TESTNET]: '0xF3a34e06015e019D6154a0f1089f695B27122f50',
    [ChainId.BSC_MAINNET]: '0x5efA1e46F4Fd738FF721F5AebC895b970F13E8A1',
  },
};

const multicall: UniqueContractInfo = {
  abi: multicallAbi,
  address: {
    [ChainId.BSC_TESTNET]: '0xca11bde05977b3631167028862be2a173976ca11',
    [ChainId.BSC_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
  },
};

const resilientOracle: UniqueContractInfo = {
  abi: resilientOracleAbi,
  address: {
    [ChainId.BSC_TESTNET]: resilientOracleTestnetDeployments.address,
    [ChainId.BSC_MAINNET]: resilientOracleMainnetDeployments.address,
  },
};

const uniqueContractInfos = {
  venusLens,
  poolLens,
  poolRegistry,
  mainPoolComptroller,
  vaiController,
  vaiVault,
  xvsVault,
  xvsStore,
  xvsVesting,
  governorBravoDelegate,
  vrtConverter,
  maximillion,
  multicall,
  resilientOracle,
};

export type UniqueContractName = keyof typeof uniqueContractInfos;

export type UniqueContractTypes = {
  venusLens: VenusLens;
  poolLens: PoolLens;
  poolRegistry: PoolRegistry;
  mainPoolComptroller: MainPoolComptroller;
  vaiController: VAIController;
  vaiVault: VAIVault;
  xvsVault: XVSVault;
  xvsStore: XVSStore;
  xvsVesting: XVSVesting;
  governorBravoDelegate: GovernorBravoDelegate;
  vrtConverter: VRTConverter;
  maximillion: Maximillion;
  multicall: Multicall;
  resilientOracle: ResilientOracle;
};

export type UniqueContractTypeByName<TContractName extends UniqueContractName> =
  UniqueContractTypes[TContractName];

export default uniqueContractInfos;

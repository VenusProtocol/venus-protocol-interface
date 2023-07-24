import { abi as isolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as poolLensAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Lens/PoolLens.sol/PoolLens.json';
import isolatedPoolsMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet.json';
import isolatedPoolsTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet.json';
import { abi as mainPoolComptrollerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Comptroller/Comptroller.sol/Comptroller.json';
import { abi as unitrollerAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Comptroller/Unitroller.sol/Unitroller.json';
import { abi as governorBravoDelegatorAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Governance/GovernorBravoDelegator.sol/GovernorBravoDelegator.json';
import { abi as venusLensAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Lens/VenusLens.sol/VenusLens.json';
import { abi as swapRouterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Swap/SwapRouter.sol/SwapRouter.json';
import { abi as vrtConverterAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VRT/VRTConverter.sol/VRTConverter.json';
import { abi as xvsVestingAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/XVS/XVSVesting.sol/XVSVesting.json';
import { abi as vaiVaultAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Vault/VAIVault.sol/VAIVault.json';
import { abi as xvsVaultAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/XVSVault/XVSVault.sol/XVSVault.json';
import venusProtocolMainnetDeployments from '@venusprotocol/venus-protocol/networks/mainnet.json';
import venusProtocolTestnetDeployments from '@venusprotocol/venus-protocol/networks/testnet.json';

import { ChainId, FixedAddressContractInfo, GenericContractInfo } from '../types/general';

import maximillionAbi from './otherAbis/maximillion.json';
import multicallAbi from './otherAbis/multicall.json';

export const venusLens: FixedAddressContractInfo = {
  abi: venusLensAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.VenusLens,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VenusLens,
  },
};

export const poolLens: FixedAddressContractInfo = {
  abi: poolLensAbi,
  address: {
    [ChainId.BSC_TESTNET]: isolatedPoolsMainnetDeployments.contracts.PoolLens.address,
    [ChainId.BSC_MAINNET]: isolatedPoolsTestnetDeployments.contracts.PoolLens.address,
  },
};

export const mainPoolComptroller: FixedAddressContractInfo = {
  abi: mainPoolComptrollerAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.Comptroller,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.Comptroller,
  },
};

export const vaiUnitrollerController: FixedAddressContractInfo = {
  abi: unitrollerAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.VaiUnitroller,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VaiUnitroller,
  },
};

export const vaiVault: FixedAddressContractInfo = {
  abi: vaiVaultAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.VAIVaultProxy,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VAIVaultProxy,
  },
};

export const xvsVault: FixedAddressContractInfo = {
  abi: xvsVaultAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.XVSVaultProxy,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.XVSVaultProxy,
  },
};

export const governorBravoDelegator: FixedAddressContractInfo = {
  abi: governorBravoDelegatorAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.GovernorBravoDelegator,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.GovernorBravoDelegator,
  },
};

export const xvsVesting: FixedAddressContractInfo = {
  abi: xvsVestingAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.XVSVestingProxy,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.XVSVestingProxy,
  },
};

export const vrtConverter: FixedAddressContractInfo = {
  abi: vrtConverterAbi,
  address: {
    [ChainId.BSC_TESTNET]: venusProtocolTestnetDeployments.Contracts.VRTConverterProxy,
    [ChainId.BSC_MAINNET]: venusProtocolMainnetDeployments.Contracts.VRTConverterProxy,
  },
};

export const maximillion: FixedAddressContractInfo = {
  abi: maximillionAbi,
  address: {
    [ChainId.BSC_TESTNET]: '0xF3a34e06015e019D6154a0f1089f695B27122f50',
    [ChainId.BSC_MAINNET]: '0x5efA1e46F4Fd738FF721F5AebC895b970F13E8A1',
  },
};

export const multicall: FixedAddressContractInfo = {
  abi: multicallAbi,
  address: {
    [ChainId.BSC_TESTNET]: '0xca11bde05977b3631167028862be2a173976ca11',
    [ChainId.BSC_MAINNET]: '0xca11bde05977b3631167028862be2a173976ca11',
  },
};

export const isolatedPoolComptroller: GenericContractInfo = {
  abi: isolatedPoolComptrollerAbi,
};

export const swapRouter: GenericContractInfo = {
  abi: swapRouterAbi,
};

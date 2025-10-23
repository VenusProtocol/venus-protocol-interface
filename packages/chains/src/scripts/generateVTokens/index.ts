#!/usr/bin/env tsx
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
import venusProtocolBscMainnetDeployments from '@venusprotocol/venus-protocol/deployments/bscmainnet_addresses.json';
import venusProtocolBscTestnetDeployments from '@venusprotocol/venus-protocol/deployments/bsctestnet_addresses.json';
import type { Address } from 'viem';

import { ChainId } from '../../types';
import { getVTokenAddresses } from './getVTokenAddresses';
import type { PoolConfig, TokenFile } from './types';
import { writeBarrelFile } from './writeBarrelFile';
import { writeVTokens } from './writeVTokens';

const poolConfigs: PoolConfig[] = [
  {
    configs: [
      {
        venusLensContractAddress: venusProtocolBscMainnetDeployments.addresses.VenusLens as Address,
        unitrollerContractAddress: venusProtocolBscMainnetDeployments.addresses
          .Unitroller_Proxy as Address,
      },
      {
        poolLensContractAddress: isolatedPoolsBscMainnetDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsBscMainnetDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'bscMainnet',
    chainId: ChainId.BSC_MAINNET,
  },
  {
    configs: [
      {
        venusLensContractAddress: venusProtocolBscTestnetDeployments.addresses.VenusLens as Address,
        unitrollerContractAddress: venusProtocolBscTestnetDeployments.addresses
          .Unitroller_Proxy as Address,
      },
      {
        poolLensContractAddress: isolatedPoolsBscTestnetDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsBscTestnetDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'bscTestnet',
    chainId: ChainId.BSC_TESTNET,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsEthereumDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsEthereumDeployments.addresses
          .PoolRegistry_Proxy as Address,
      },
    ],
    tokenFileName: 'ethereum',
    chainId: ChainId.ETHEREUM,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsSepoliaDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsSepoliaDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'sepolia',
    chainId: ChainId.SEPOLIA,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsArbitrumOneDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsArbitrumOneDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'arbitrumOne',
    chainId: ChainId.ARBITRUM_ONE,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsArbitrumSepoliaDeployments.addresses
          .PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsArbitrumSepoliaDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'arbitrumSepolia',
    chainId: ChainId.ARBITRUM_SEPOLIA,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsBaseMainnetDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsBaseMainnetDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'baseMainnet',
    chainId: ChainId.BASE_MAINNET,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsBaseSepoliaDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsBaseSepoliaDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'baseSepolia',
    chainId: ChainId.BASE_SEPOLIA,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsOpBnbMainnetDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsOpBnbMainnetDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'opBnbMainnet',
    chainId: ChainId.OPBNB_MAINNET,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsOpBnbTestnetDeployments.addresses.PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsOpBnbTestnetDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'opBnbTestnet',
    chainId: ChainId.OPBNB_TESTNET,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsOptimismMainnetDeployments.addresses
          .PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsOptimismMainnetDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'optimismMainnet',
    chainId: ChainId.OPTIMISM_MAINNET,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsOptimismSepoliaDeployments.addresses
          .PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsOptimismSepoliaDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'optimismSepolia',
    chainId: ChainId.OPTIMISM_SEPOLIA,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsZkSyncMainnetDeployments.addresses
          .PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsZkSyncMainnetDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'zkSyncMainnet',
    chainId: ChainId.ZKSYNC_MAINNET,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsZkSyncSepoliaDeployments.addresses
          .PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsZkSyncSepoliaDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'zkSyncSepolia',
    chainId: ChainId.ZKSYNC_SEPOLIA,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsUnichainMainnetDeployments.addresses
          .PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsUnichainMainnetDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'unichainMainnet',
    chainId: ChainId.UNICHAIN_MAINNET,
  },
  {
    configs: [
      {
        poolLensContractAddress: isolatedPoolsUnichainSepoliaDeployments.addresses
          .PoolLens as Address,
        poolRegistryContractAddress: isolatedPoolsUnichainSepoliaDeployments.addresses
          .PoolRegistry as Address,
      },
    ],
    tokenFileName: 'unichainSepolia',
    chainId: ChainId.UNICHAIN_SEPOLIA,
  },
];

const generateVTokens = async () => {
  // Fetch vToken addresses on all chains
  const vTokenAddresses = await Promise.all(
    poolConfigs.map(poolConfig => getVTokenAddresses({ poolConfig })),
  );

  const tokenFiles: TokenFile[] = poolConfigs.map((config, i) => ({
    vTokenAddresses: vTokenAddresses[i].vTokenAddresses,
    tokenFileName: config.tokenFileName,
    chainId: config.chainId,
  }));

  // Generate individual chain token lists
  await Promise.all(
    tokenFiles.map(tokenFile =>
      writeVTokens({
        vTokenAddresses: tokenFile.vTokenAddresses,
        chainId: tokenFile.chainId,
        outputFileName: tokenFile.tokenFileName,
      }),
    ),
  );

  // Generate barrel file
  writeBarrelFile({
    tokenFiles,
  });
};

console.log('Generating VToken records...');

generateVTokens()
  .then(() => console.log('Finished generating VToken records'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

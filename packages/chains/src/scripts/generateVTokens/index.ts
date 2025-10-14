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
import { writeVTokens } from './writeVTokens';

console.log('Generating VToken records...');

writeVTokens({
  addresses: {
    ...venusProtocolBscMainnetDeployments.addresses,
    ...isolatedPoolsBscMainnetDeployments.addresses,
  } as Record<string, Address>,
  outputFileName: 'bscmainnet.ts',
  chainId: ChainId.BSC_MAINNET,
})
  .then(() => console.log('Finished generating VToken records'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

import type { Address } from 'viem';

import { createPublicClient } from '../../../utilities/createPublicClient';
import type { PoolConfig } from '../types';
import { abi as poolLensAbi } from './poolLensAbi';
import { abi as venusLensAbi } from './venusLensAbi';

export const getVTokenAddresses = async ({ poolConfig }: { poolConfig: PoolConfig }) => {
  const publicClient = createPublicClient({ chainId: poolConfig.chainId });

  const results = await publicClient.multicall({
    contracts: poolConfig.configs.map(config =>
      'venusLensContractAddress' in config
        ? ({
            address: config.venusLensContractAddress,
            abi: venusLensAbi,
            functionName: 'getAllPoolsData',
            args: [config.unitrollerContractAddress],
          } as const)
        : ({
            address: config.poolLensContractAddress,
            abi: poolLensAbi,
            functionName: 'getAllPools',
            args: [config.poolRegistryContractAddress],
          } as const),
    ),
    allowFailure: false,
  });

  const vTokenAddresses: Address[] = [];

  results.forEach(result => {
    if (!result) {
      return;
    }

    vTokenAddresses.push(
      ...result.flatMap(result =>
        ('markets' in result ? result.markets : result.vTokens).reduce<Address[]>(
          (acc, m) =>
            // Filter out unlisted markets
            m.isListed ? [...acc, m.vToken] : acc,
          [],
        ),
      ),
    );
  });

  return { vTokenAddresses };
};

import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { contractInfos } from 'packages/contracts';

import { TOKENS } from 'constants/tokens';

import formatOutput from './formatOutput';
import { GetPendingRewardGroupsInput, GetPendingRewardGroupsOutput } from './types';

const getPendingRewardGroups = async ({
  mainPoolComptrollerContractAddress,
  isolatedPoolComptrollerAddresses,
  xvsVestingVaultPoolCount,
  multicall,
  accountAddress,
  venusLensContractAddress,
  poolLensContractAddress,
  vaiVaultContractAddress,
  xvsVaultContractAddress,
}: GetPendingRewardGroupsInput): Promise<GetPendingRewardGroupsOutput> => {
  // Generate call context
  const contractCallContext: ContractCallContext[] = [
    // Pending rewards from main pool
    {
      reference: 'venusLens',
      contractAddress: venusLensContractAddress,
      abi: contractInfos.venusLens.abi,
      calls: [
        {
          reference: 'pendingRewards',
          methodName: 'pendingRewards',
          methodParameters: [accountAddress, mainPoolComptrollerContractAddress],
        },
      ],
    },
    // Pending rewards from vaults
    {
      reference: 'vaiVault',
      contractAddress: vaiVaultContractAddress,
      abi: contractInfos.vaiVault.abi,
      calls: [
        {
          reference: 'pendingXVS',
          methodName: 'pendingXVS',
          methodParameters: [accountAddress],
        },
      ],
    },
    {
      reference: 'xvsVestingVaults',
      contractAddress: xvsVaultContractAddress,
      abi: contractInfos.xvsVault.abi,
      calls: new Array(xvsVestingVaultPoolCount).fill(undefined).reduce(
        (acc, _item, poolIndex) =>
          acc.concat([
            {
              reference: `vault-${poolIndex}-poolInfos`,
              methodName: 'poolInfos',
              methodParameters: [TOKENS.xvs.address, poolIndex],
            },
            {
              reference: `vault-${poolIndex}-pendingReward`,
              methodName: 'pendingReward',
              methodParameters: [TOKENS.xvs.address, poolIndex, accountAddress],
            },
            {
              reference: `vault-${poolIndex}-pendingWithdrawalsBeforeUpgrade`,
              methodName: 'pendingWithdrawalsBeforeUpgrade',
              methodParameters: [TOKENS.xvs.address, poolIndex, accountAddress],
            },
          ]),
        [],
      ),
    },
  ];

  if (isolatedPoolComptrollerAddresses.length > 0) {
    // Pending rewards from isolated pools
    contractCallContext.push({
      reference: 'poolLens',
      contractAddress: poolLensContractAddress,
      abi: contractInfos.poolLens.abi,
      calls: isolatedPoolComptrollerAddresses.map(isolatedPoolComptrollerAddress => ({
        reference: 'getPendingRewards',
        methodName: 'getPendingRewards',
        methodParameters: [accountAddress, isolatedPoolComptrollerAddress],
      })),
    });
  }

  const contractCallResults: ContractCallResults = await multicall.call(contractCallContext);

  const pendingRewardGroups = formatOutput({
    contractCallResults,
  });

  return {
    pendingRewardGroups,
  };
};

export default getPendingRewardGroups;

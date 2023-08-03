import { ContractCallContext, ContractCallResults } from 'ethereum-multicall';
import { contractInfos } from 'packages/contracts';
import { getContractAddress } from 'utilities';

import { TOKENS } from 'constants/tokens';

import formatOutput from './formatOutput';
import { GetPendingRewardGroupsInput, GetPendingRewardGroupsOutput } from './types';

// TODO: get addresses from contracts package
const venusLensAddress = getContractAddress('venusLens');
const poolLensAddress = getContractAddress('PoolLens');
const vaiVaultAddress = getContractAddress('vaiVault');
const xvsVaultAddress = getContractAddress('xvsVaultProxy');

const getPendingRewardGroups = async ({
  mainPoolComptrollerAddress,
  isolatedPoolComptrollerAddresses,
  xvsVestingVaultPoolCount,
  multicall,
  accountAddress,
}: GetPendingRewardGroupsInput): Promise<GetPendingRewardGroupsOutput> => {
  // Generate call context
  const contractCallContext: ContractCallContext[] = [
    // Pending rewards from main pool
    {
      reference: 'venusLens',
      contractAddress: venusLensAddress,
      abi: contractInfos.venusLens.abi,
      calls: [
        {
          reference: 'pendingRewards',
          methodName: 'pendingRewards',
          methodParameters: [accountAddress, mainPoolComptrollerAddress],
        },
      ],
    },
    // Pending rewards from vaults
    {
      reference: 'vaiVault',
      contractAddress: vaiVaultAddress,
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
      contractAddress: xvsVaultAddress,
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
      contractAddress: poolLensAddress,
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

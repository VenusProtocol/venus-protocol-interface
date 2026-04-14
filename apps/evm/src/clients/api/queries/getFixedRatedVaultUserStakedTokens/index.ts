import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { institutionalVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';

export interface GetFixedRatedVaultUserStakedTokensInput {
  accountAddress: Address;
  vaultAddresses: Address[];
  publicClient: PublicClient;
}

export type FixedRatedVaultUserStakedAmount = {
  vaultAddress: Address;
  tokensMantissa: BigNumber;
};

export type GetFixedRatedVaultUserStakedTokensOutput = FixedRatedVaultUserStakedAmount[];

export const getFixedRatedVaultUserStakedTokens = async ({
  publicClient,
  accountAddress,
  vaultAddresses,
}: GetFixedRatedVaultUserStakedTokensInput): Promise<GetFixedRatedVaultUserStakedTokensOutput> => {
  if (!accountAddress) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: 'accountAddress is required' },
    });
  }

  const results = await publicClient.multicall({
    contracts: vaultAddresses.map(vaultAddress => ({
      abi: institutionalVaultAbi,
      address: vaultAddress,
      functionName: 'balanceOf' as const,
      args: [accountAddress],
    })),
  });

  const userStakedTokens = results.reduce<GetFixedRatedVaultUserStakedTokensOutput>(
    (acc, result, index) => {
      if (result.status === 'success') {
        acc.push({
          vaultAddress: vaultAddresses[index],
          tokensMantissa: new BigNumber(result.result.toString()),
        });
      }

      return acc;
    },
    [],
  );

  return userStakedTokens;
};

import { primeAbi, primeV2Abi } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { PrimeVersion } from 'types';
import type { Address, PublicClient } from 'viem';

export interface GetPrimeVaultConfigInput {
  primeContractAddress: Address;
  primeVersion: PrimeVersion;
  publicClient: PublicClient;
}

export interface GetPrimeVaultConfigOutput {
  poolIndex: number;
  rewardTokenAddress: Address;
}

export const getPrimeVaultConfig = async ({
  primeContractAddress,
  primeVersion,
  publicClient,
}: GetPrimeVaultConfigInput): Promise<GetPrimeVaultConfigOutput> => {
  const abi = primeVersion === 1 ? primeAbi : primeV2Abi;

  const [xvsVaultPoolIdResult, rewardTokenAddressResult] = await publicClient.multicall({
    contracts: [
      {
        abi,
        address: primeContractAddress,
        functionName: 'xvsVaultPoolId',
      },
      {
        abi,
        address: primeContractAddress,
        functionName: 'xvsVaultRewardToken',
      },
    ],
  });

  if (xvsVaultPoolIdResult.status === 'failure' || rewardTokenAddressResult.status === 'failure') {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return {
    poolIndex: Number(xvsVaultPoolIdResult.result),
    rewardTokenAddress: rewardTokenAddressResult.result,
  };
};

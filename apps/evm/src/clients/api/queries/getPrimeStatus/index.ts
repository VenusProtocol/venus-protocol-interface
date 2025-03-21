import BigNumber from 'bignumber.js';
import type { Address, PublicClient } from 'viem';

import { NULL_ADDRESS } from 'constants/address';
import { primeAbi } from 'libs/contracts';
import { VError, logError } from 'libs/errors';

export interface GetPrimeStatusInput {
  accountAddress?: Address;
  primeContractAddress: Address;
  publicClient: PublicClient;
}

export interface GetPrimeStatusOutput {
  claimWaitingPeriodSeconds: number;
  claimedPrimeTokenCount: number;
  primeTokenLimit: number;
  primeMarkets: Address[];
  primeMaximumStakedXvsMantissa: BigNumber;
  primeMinimumStakedXvsMantissa: BigNumber;
  xvsVault: Address;
  xvsVaultPoolId: number;
  rewardTokenAddress: Address;
  userClaimTimeRemainingSeconds: number;
}

const getPrimeStatus = async ({
  accountAddress,
  primeContractAddress,
  publicClient,
}: GetPrimeStatusInput): Promise<GetPrimeStatusOutput> => {
  const [
    claimWaitingPeriodSeconds,
    primeMaximumStakedXvsMantissa,
    primeMinimumStakedXvsMantissa,
    claimedPrimeTokens,
    revocableLimit,
    primeMarkets,
    xvsVault,
    xvsVaultPoolId,
    rewardTokenAddress,
    userClaimTimeRemainingSeconds,
  ] = await publicClient.multicall({
    contracts: [
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'STAKING_PERIOD',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'MAXIMUM_XVS_CAP',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'MINIMUM_STAKED_XVS',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'totalRevocable',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'revocableLimit',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'getAllMarkets',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'xvsVault',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'xvsVaultPoolId',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'xvsVaultRewardToken',
      },
      {
        address: primeContractAddress,
        abi: primeAbi,
        functionName: 'claimTimeRemaining',
        args: [accountAddress ? accountAddress : NULL_ADDRESS],
      },
    ],
  });

  if (
    claimWaitingPeriodSeconds.status === 'failure' ||
    primeMaximumStakedXvsMantissa.status === 'failure' ||
    primeMinimumStakedXvsMantissa.status === 'failure' ||
    claimedPrimeTokens.status === 'failure' ||
    revocableLimit.status === 'failure' ||
    primeMarkets.status === 'failure' ||
    xvsVault.status === 'failure' ||
    xvsVaultPoolId.status === 'failure' ||
    rewardTokenAddress.status === 'failure' ||
    userClaimTimeRemainingSeconds.status === 'failure'
  ) {
    logError(
      claimWaitingPeriodSeconds.error ||
        primeMaximumStakedXvsMantissa.error ||
        primeMinimumStakedXvsMantissa.error ||
        claimedPrimeTokens.error ||
        revocableLimit.error ||
        primeMarkets.error ||
        xvsVault.error ||
        xvsVaultPoolId.error ||
        rewardTokenAddress.error ||
        userClaimTimeRemainingSeconds.error,
    );

    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return {
    claimWaitingPeriodSeconds: Number(claimWaitingPeriodSeconds.result),
    primeMaximumStakedXvsMantissa: new BigNumber(primeMaximumStakedXvsMantissa.result.toString()),
    primeMinimumStakedXvsMantissa: new BigNumber(primeMinimumStakedXvsMantissa.result.toString()),
    claimedPrimeTokenCount: Number(claimedPrimeTokens.result),
    primeTokenLimit: Number(revocableLimit.result),
    primeMarkets: [...primeMarkets.result],
    xvsVault: xvsVault.result,
    xvsVaultPoolId: Number(xvsVaultPoolId.result),
    rewardTokenAddress: rewardTokenAddress.result,
    userClaimTimeRemainingSeconds: Number(userClaimTimeRemainingSeconds.result),
  };
};

export default getPrimeStatus;

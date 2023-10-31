import BigNumber from 'bignumber.js';
import { Prime } from 'packages/contracts';

export interface GetPrimeStatusInput {
  accountAddress: string;
  primeContract: Prime;
}

export interface GetPrimeStatusOutput {
  claimWaitingPeriodSeconds: number;
  claimedPrimeTokenCount: number;
  primeTokenLimit: number;
  primeMinimumStakedXvsMantissa: BigNumber;
  xvsVault: string;
  xvsVaultPoolId: number;
  rewardTokenAddress: string;
  userClaimTimeRemainingSeconds: number;
}

const getPrimeStatus = async ({
  accountAddress,
  primeContract,
}: GetPrimeStatusInput): Promise<GetPrimeStatusOutput> => {
  const [
    claimWaitingPeriodSeconds,
    primeMinimumStakedXvsMantissa,
    claimedPrimeTokens,
    revocableLimit,
    xvsVault,
    xvsVaultPoolId,
    rewardTokenAddress,
    userClaimTimeRemainingSeconds,
  ] = await Promise.all([
    primeContract.STAKING_PERIOD(),
    primeContract.MINIMUM_STAKED_XVS(),
    primeContract.totalRevocable(),
    primeContract.revocableLimit(),
    primeContract.xvsVault(),
    primeContract.xvsVaultPoolId(),
    primeContract.xvsVaultRewardToken(),
    primeContract.claimTimeRemaining(accountAddress),
  ]);

  return {
    claimWaitingPeriodSeconds: claimWaitingPeriodSeconds.toNumber(),
    primeMinimumStakedXvsMantissa: new BigNumber(primeMinimumStakedXvsMantissa.toString()),
    claimedPrimeTokenCount: claimedPrimeTokens.toNumber(),
    primeTokenLimit: revocableLimit.toNumber(),
    xvsVault,
    xvsVaultPoolId: xvsVaultPoolId.toNumber(),
    rewardTokenAddress,
    userClaimTimeRemainingSeconds: userClaimTimeRemainingSeconds.toNumber(),
  };
};

export default getPrimeStatus;

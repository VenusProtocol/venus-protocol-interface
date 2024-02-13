import BigNumber from 'bignumber.js';

import { NULL_ADDRESS } from 'constants/address';
import { Prime } from 'libs/contracts';

export interface GetPrimeStatusInput {
  accountAddress?: string;
  primeContract: Prime;
}

export interface GetPrimeStatusOutput {
  claimWaitingPeriodSeconds: number;
  claimedPrimeTokenCount: number;
  primeTokenLimit: number;
  primeMarkets: string[];
  primeMaximumStakedXvsMantissa: BigNumber;
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
    primeMaximumStakedXvsMantissa,
    primeMinimumStakedXvsMantissa,
    claimedPrimeTokens,
    revocableLimit,
    primeMarkets,
    xvsVault,
    xvsVaultPoolId,
    rewardTokenAddress,
    userClaimTimeRemainingSeconds,
  ] = await Promise.all([
    primeContract.STAKING_PERIOD(),
    primeContract.MAXIMUM_XVS_CAP(),
    primeContract.MINIMUM_STAKED_XVS(),
    primeContract.totalRevocable(),
    primeContract.revocableLimit(),
    primeContract.getAllMarkets(),
    primeContract.xvsVault(),
    primeContract.xvsVaultPoolId(),
    primeContract.xvsVaultRewardToken(),
    primeContract.claimTimeRemaining(accountAddress || NULL_ADDRESS),
  ]);

  return {
    claimWaitingPeriodSeconds: claimWaitingPeriodSeconds.toNumber(),
    primeMaximumStakedXvsMantissa: new BigNumber(primeMaximumStakedXvsMantissa.toString()),
    primeMinimumStakedXvsMantissa: new BigNumber(primeMinimumStakedXvsMantissa.toString()),
    claimedPrimeTokenCount: claimedPrimeTokens.toNumber(),
    primeTokenLimit: revocableLimit.toNumber(),
    primeMarkets,
    xvsVault,
    xvsVaultPoolId: xvsVaultPoolId.toNumber(),
    rewardTokenAddress,
    userClaimTimeRemainingSeconds: userClaimTimeRemainingSeconds.toNumber(),
  };
};

export default getPrimeStatus;

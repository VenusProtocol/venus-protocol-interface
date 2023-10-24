import BigNumber from 'bignumber.js';
import { Prime } from 'packages/contracts';

export interface GetPrimeClaimWaitingPeriodInput {
  primeContract: Prime;
}

export interface GetPrimeClaimWaitingPeriodOutput {
  claimWaitingPeriod: number;
  claimedPrimeTokenCount: number;
  primeTokenLimit: number;
  primeMinimumStakedXvsMantissa: BigNumber;
  xvsVault: string;
  xvsVaultPoolId: number;
  rewardTokenAddress: string;
}

const getPrimeStatus = async ({
  primeContract,
}: GetPrimeClaimWaitingPeriodInput): Promise<GetPrimeClaimWaitingPeriodOutput> => {
  const [
    claimWaitingPeriod,
    primeMinimumStakedXvsMantissa,
    claimedPrimeTokens,
    revocableLimit,
    xvsVault,
    xvsVaultPoolId,
    rewardTokenAddress,
  ] = await Promise.all([
    primeContract.STAKING_PERIOD(),
    primeContract.MINIMUM_STAKED_XVS(),
    primeContract.totalRevocable(),
    primeContract.revocableLimit(),
    primeContract.xvsVault(),
    primeContract.xvsVaultPoolId(),
    primeContract.xvsVaultRewardToken(),
  ]);

  return {
    claimWaitingPeriod: claimWaitingPeriod.toNumber(),
    primeMinimumStakedXvsMantissa: new BigNumber(primeMinimumStakedXvsMantissa.toString()),
    claimedPrimeTokenCount: claimedPrimeTokens.toNumber(),
    primeTokenLimit: revocableLimit.toNumber(),
    xvsVault,
    xvsVaultPoolId: xvsVaultPoolId.toNumber(),
    rewardTokenAddress,
  };
};

export default getPrimeStatus;

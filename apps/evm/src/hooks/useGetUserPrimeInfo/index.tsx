import BigNumber from 'bignumber.js';
import {
  useGetPools,
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetXvsVaultUserInfo,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetToken } from 'libs/tokens';
import { convertMantissaToTokens, generatePseudoRandomRefetchInterval } from 'utilities';
import type { Address } from 'viem';

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetUserPrimeInfo = ({ accountAddress }: { accountAddress?: Address }) => {
  const isPrimeFeatureEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken(
    {
      accountAddress,
    },
    {
      enabled: isPrimeFeatureEnabled,
    },
  );
  const isUserPrime = !!getPrimeTokenData?.exists;

  const { data: primeStatusData, isLoading: isGetPrimeStatusLoading } = useGetPrimeStatus(
    {
      accountAddress,
    },
    {
      enabled: isPrimeFeatureEnabled && !isGetPrimeTokenLoading && !isUserPrime,
      refetchInterval,
    },
  );

  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const pools = getPoolsData?.pools || [];
  const userHighestPrimeSimulationApyBoostPercentage = pools.reduce<BigNumber | undefined>(
    (max, pool) =>
      pool.assets.reduce<BigNumber | undefined>(
        (assetMax, asset) =>
          asset.supplyTokenDistributions
            .concat(asset.borrowTokenDistributions)
            .reduce<BigNumber | undefined>((distMax, distribution) => {
              if (
                distribution.type === 'primeSimulation' &&
                (!distMax || distribution.apyPercentage.gt(distMax))
              ) {
                return distribution.apyPercentage;
              }

              return distMax;
            }, assetMax),
        max,
      ),
    undefined,
  );

  const { data: userStakedXvsTokensData, isLoading: isGetXvsVaultUserInfoLoading } =
    useGetXvsVaultUserInfo(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
        rewardTokenAddress: primeStatusData?.rewardTokenAddress || NULL_ADDRESS,
        poolIndex: primeStatusData?.xvsVaultPoolId || 0,
      },
      {
        enabled: isPrimeFeatureEnabled && !!accountAddress && !!primeStatusData,
      },
    );

  const userNonPendingStakedXvsMantissa = userStakedXvsTokensData?.stakedAmountMantissa.minus(
    userStakedXvsTokensData.pendingWithdrawalsTotalAmountMantissa,
  );

  const {
    primeTokenLimit,
    primeMinimumStakedXvsMantissa,
    claimWaitingPeriodSeconds,
    claimedPrimeTokenCount,
    userClaimTimeRemainingSeconds,
  } = primeStatusData ?? {};

  const userStakedXvsTokens = convertMantissaToTokens({
    value: userNonPendingStakedXvsMantissa || new BigNumber('0'),
    token: xvs,
  });

  const minXvsToStakeForPrimeTokens = convertMantissaToTokens({
    value: primeMinimumStakedXvsMantissa || new BigNumber('0'),
    token: xvs,
  });

  const isLoading =
    isGetPrimeTokenLoading ||
    isGetPrimeStatusLoading ||
    isGetPoolsLoading ||
    isGetXvsVaultUserInfoLoading;

  return {
    isLoading,
    data: {
      isUserPrime,
      claimWaitingPeriodSeconds,
      userClaimTimeRemainingSeconds,
      userHighestPrimeSimulationApyBoostPercentage,
      userStakedXvsTokens,
      minXvsToStakeForPrimeTokens,
      claimedPrimeTokenCount,
      primeTokenLimit,
    },
  };
};

import { useGetPrimeVaultConfig, useGetSimulatedPool, useGetXvsVaultUserInfo } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useIsUserPrime } from 'hooks/useIsUserPrime';
import { useAccountAddress } from 'libs/wallet';
import type { BalanceMutation, Pool } from 'types';

export const useSimulateBalanceMutations = ({
  balanceMutations,
  pool,
}: {
  balanceMutations: BalanceMutation[];
  pool?: Pool;
}) => {
  const { accountAddress } = useAccountAddress();
  const hasAccount = !!accountAddress;
  const { isUserPrime, isLoading: isUserPrimeLoading } = useIsUserPrime({ accountAddress });
  const { data: primeVaultConfigData, isLoading: isPrimeVaultConfigLoading } =
    useGetPrimeVaultConfig();
  const poolIndex = primeVaultConfigData?.poolIndex;
  const rewardTokenAddress = primeVaultConfigData?.rewardTokenAddress;
  const shouldFetchXvsVaultUserInfo = hasAccount && poolIndex !== undefined && !!rewardTokenAddress;

  const { data: xvsVaultUserInfoData, isLoading: isGetXvsVaultUserInfoLoading } =
    useGetXvsVaultUserInfo(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
        rewardTokenAddress: rewardTokenAddress || NULL_ADDRESS,
        poolIndex: poolIndex || 0,
      },
      {
        enabled: shouldFetchXvsVaultUserInfo,
      },
    );

  const userXvsStakedMantissa = xvsVaultUserInfoData?.stakedAmountMantissa.minus(
    xvsVaultUserInfoData.pendingWithdrawalsTotalAmountMantissa,
  );

  const isPrimeContextLoading =
    hasAccount &&
    (isPrimeVaultConfigLoading || (shouldFetchXvsVaultUserInfo && isGetXvsVaultUserInfoLoading));

  const isSimulationLoading = isUserPrimeLoading || isPrimeContextLoading;

  const { data, isLoading: isGetSimulatedPoolLoading } = useGetSimulatedPool(
    {
      pool,
      balanceMutations,
      accountAddress,
      isUserPrime,
      userXvsStakedMantissa,
    },
    {
      enabled: !isSimulationLoading,
    },
  );

  return {
    isLoading: isSimulationLoading || isGetSimulatedPoolLoading,
    data,
  };
};

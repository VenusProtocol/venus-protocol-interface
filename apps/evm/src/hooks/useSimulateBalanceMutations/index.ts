import { useGetSimulatedPool } from 'clients/api';
import { useGetUserPrimeInfo } from 'hooks/useGetUserPrimeInfo';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress } from 'libs/wallet';
import type { BalanceMutation, Pool } from 'types';
import { convertTokensToMantissa } from 'utilities';

export const useSimulateBalanceMutations = ({
  balanceMutations,
  pool,
}: {
  balanceMutations: BalanceMutation[];
  pool?: Pool;
}) => {
  const { accountAddress } = useAccountAddress();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: { isUserPrime, userStakedXvsTokens },
    isLoading: isGetUserPrimeInfoLoading,
  } = useGetUserPrimeInfo({ accountAddress });

  const userXvsStakedMantissa =
    xvs &&
    convertTokensToMantissa({
      value: userStakedXvsTokens,
      token: xvs,
    });

  const { data, isLoading: isGetSimulatedPoolLoading } = useGetSimulatedPool(
    {
      pool,
      balanceMutations,
      accountAddress,
      isUserPrime,
      userXvsStakedMantissa,
    },
    {
      enabled: !isGetUserPrimeInfoLoading,
    },
  );

  const isLoading = isGetUserPrimeInfoLoading || isGetSimulatedPoolLoading;

  return {
    isLoading,
    data,
  };
};

import { useGetIsUserPrimeV2, useGetPrimeToken } from 'clients/api';
import { usePrimeVersion } from 'hooks/usePrimeVersion';
import type { Address } from 'viem';

export interface UseIsUserPrimeInput {
  accountAddress?: Address;
}

export interface UseIsUserPrimeOutput {
  isUserPrime: boolean;
  isLoading: boolean;
}

export const useIsUserPrime = ({ accountAddress }: UseIsUserPrimeInput): UseIsUserPrimeOutput => {
  const { primeVersion } = usePrimeVersion();

  const { data: primeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken(
    {
      accountAddress,
    },
    {
      enabled: primeVersion === 1,
    },
  );

  const { data: isUserPrimeV2Data, isLoading: isGetIsUserPrimeV2Loading } = useGetIsUserPrimeV2(
    {
      accountAddress,
    },
    {
      enabled: primeVersion === 2,
    },
  );

  const isUserPrime =
    primeVersion === 1 ? !!primeTokenData?.exists : !!isUserPrimeV2Data?.isPrimeHolder;

  const isLoading = primeVersion === 1 ? isGetPrimeTokenLoading : isGetIsUserPrimeV2Loading;

  return {
    isUserPrime,
    isLoading,
  };
};

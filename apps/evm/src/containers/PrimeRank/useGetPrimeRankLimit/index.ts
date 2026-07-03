import { useGetPrimeMinimumStake, useGetPrimeTokenLimit } from 'clients/api';

// Effective number of wallets that become Prime each cycle, preferring the API value and falling
// back to the on-chain token limit
export const useGetPrimeRankLimit = (): number | undefined => {
  const { data: minimumStake } = useGetPrimeMinimumStake();
  const { data: tokenLimitData } = useGetPrimeTokenLimit();

  return minimumStake?.tokenLimit ?? tokenLimitData?.tokenLimit;
};

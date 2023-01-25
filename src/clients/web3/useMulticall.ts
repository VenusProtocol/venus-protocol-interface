import { Multicall } from 'ethereum-multicall';
import { useMemo } from 'react';

import { useAuth } from 'clients/web3';

const useMulticall = () => {
  const { provider } = useAuth();
  return useMemo(
    () =>
      new Multicall({
        // @ts-expect-error The Provider type used by Multicall only has one
        // difference with the provider returned by wagmi (lastBaseFeePerGas).
        // Since this isn't used by Multicall, we can safely pass it the wagmi
        // provider
        ethersProvider: provider,
        tryAggregate: true,
      }),
    [provider],
  );
};

export default useMulticall;

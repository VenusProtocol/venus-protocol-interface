import { Multicall as Multicall3 } from 'ethereum-multicall';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

const useMulticall3 = () => {
  const { provider } = useAuth();
  return useMemo(
    () =>
      new Multicall3({
        ethersProvider: provider,
        tryAggregate: true,
      }),
    [provider],
  );
};

export default useMulticall3;

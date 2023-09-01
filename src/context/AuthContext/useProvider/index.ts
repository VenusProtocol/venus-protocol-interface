import { useMemo } from 'react';
import { usePublicClient } from 'wagmi';

import getProvider from './getProvider';

const useProvider = () => {
  const publicClient = usePublicClient();
  return useMemo(() => getProvider({ publicClient }), [publicClient]);
};

export default useProvider;

import { useMemo } from 'react';
import { useWalletClient } from 'wagmi';

import getSigner from './getSigner';

const useSigner = () => {
  const { data: walletClient } = useWalletClient();
  return useMemo(() => getSigner({ walletClient: walletClient || undefined }), [walletClient]);
};

export default useSigner;

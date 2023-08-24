import { useMemo } from 'react';
import { VToken } from 'types';
import { getVTokenContract } from 'utilities';

import { useAuth } from 'context/AuthContext';

const useGetVTokenContract = (vToken: VToken) => {
  const { signer, provider, chainId } = useAuth();
  const signerOrProvider = signer || provider;

  return useMemo(
    () =>
      chainId !== undefined // Although chainId isn't used, we don't want to fetch any data unless it exists
        ? getVTokenContract({ vToken, signerOrProvider })
        : undefined,
    [signerOrProvider, chainId, vToken],
  );
};

export default useGetVTokenContract;

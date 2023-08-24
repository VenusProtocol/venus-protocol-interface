import { useMemo } from 'react';
import { Token } from 'types';
import { getTokenContract } from 'utilities';

import { useAuth } from 'context/AuthContext';

const useGetTokenContract = (token: Token) => {
  const { signer, provider, chainId } = useAuth();
  const signerOrProvider = signer || provider;

  return useMemo(
    () =>
      chainId !== undefined // Although chainId isn't used, we don't want to fetch any data unless it exists
        ? getTokenContract({ token, signerOrProvider })
        : undefined,
    [signerOrProvider, chainId, token],
  );
};

export default useGetTokenContract;

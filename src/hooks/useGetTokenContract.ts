import { useMemo } from 'react';
import { Token } from 'types';
import { getTokenContract } from 'utilities';

import { useAuth } from 'context/AuthContext';

export interface UseGetTokenContractInput {
  token: Token;
  passSigner?: boolean;
}

const useGetTokenContract = ({ token, passSigner = false }: UseGetTokenContractInput) => {
  const { signer, provider, chainId } = useAuth();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () =>
      chainId !== undefined && // Although chainId isn't used, we don't want to fetch any data unless it exists
      !!signerOrProvider
        ? getTokenContract({ token, signerOrProvider })
        : undefined,
    [signerOrProvider, chainId, token],
  );
};

export default useGetTokenContract;

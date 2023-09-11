import { useMemo } from 'react';
import { Token } from 'types';
import { getTokenContract } from 'utilities';

import { useAuth } from 'context/AuthContext';

export interface UseGetTokenContractInput {
  token: Token;
  passSigner?: boolean;
}

const useGetTokenContract = ({ token, passSigner = false }: UseGetTokenContractInput) => {
  const { signer, provider } = useAuth();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () => (signerOrProvider ? getTokenContract({ token, signerOrProvider }) : undefined),
    [signerOrProvider, token],
  );
};

export default useGetTokenContract;

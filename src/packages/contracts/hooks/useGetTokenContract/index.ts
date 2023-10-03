import { useMemo } from 'react';
import { Token } from 'types';

import { useAuth } from 'context/AuthContext';
import { getTokenContract } from 'packages/contracts/utilities/getTokenContract';

export interface UseGetTokenContractInput {
  token: Token;
  passSigner?: boolean;
}

export const useGetTokenContract = ({ token, passSigner = false }: UseGetTokenContractInput) => {
  const { signer, provider } = useAuth();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () => (signerOrProvider ? getTokenContract({ token, signerOrProvider }) : undefined),
    [signerOrProvider, token],
  );
};

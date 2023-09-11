import { useMemo } from 'react';
import { VToken } from 'types';
import { getVTokenContract } from 'utilities';

import { useAuth } from 'context/AuthContext';

export interface UseGetVTokenContractInput {
  vToken: VToken;
  passSigner?: boolean;
}

const useGetVTokenContract = ({ vToken, passSigner = false }: UseGetVTokenContractInput) => {
  const { signer, provider } = useAuth();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () => (signerOrProvider ? getVTokenContract({ vToken, signerOrProvider }) : undefined),
    [signerOrProvider, vToken],
  );
};

export default useGetVTokenContract;

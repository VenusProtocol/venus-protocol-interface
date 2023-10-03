import { useMemo } from 'react';
import { VToken } from 'types';

import { useAuth } from 'context/AuthContext';
import { getVTokenContract } from 'packages/contracts/utilities/getVTokenContract';

export interface UseGetVTokenContractInput {
  vToken: VToken;
  passSigner?: boolean;
}

export const useGetVTokenContract = ({ vToken, passSigner = false }: UseGetVTokenContractInput) => {
  const { signer, provider } = useAuth();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () => (signerOrProvider ? getVTokenContract({ vToken, signerOrProvider }) : undefined),
    [signerOrProvider, vToken],
  );
};

import { useMemo } from 'react';
import { VToken } from 'types';
import { getVTokenContract } from 'utilities';

import { useAuth } from 'context/AuthContext';

export interface UseGetVTokenContractInput {
  vToken: VToken;
  passSigner?: boolean;
}

const useGetVTokenContract = ({ vToken, passSigner = false }: UseGetVTokenContractInput) => {
  const { signer, provider, chainId } = useAuth();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () =>
      chainId !== undefined && // Although chainId isn't used, we don't want to fetch any data unless it exists
      !!signerOrProvider
        ? getVTokenContract({ vToken, signerOrProvider })
        : undefined,
    [signerOrProvider, chainId, vToken],
  );
};

export default useGetVTokenContract;

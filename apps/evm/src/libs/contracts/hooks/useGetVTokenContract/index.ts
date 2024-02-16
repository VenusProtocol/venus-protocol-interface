import { useMemo } from 'react';

import { getVTokenContract } from 'libs/contracts';
import { useProvider, useSigner } from 'libs/wallet';
import { VToken } from 'types';

export interface UseGetVTokenContractInput {
  vToken: VToken;
  passSigner?: boolean;
}

export const useGetVTokenContract = ({ vToken, passSigner = false }: UseGetVTokenContractInput) => {
  const { provider } = useProvider();
  const { signer } = useSigner();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () => (signerOrProvider ? getVTokenContract({ vToken, signerOrProvider }) : undefined),
    [signerOrProvider, vToken],
  );
};

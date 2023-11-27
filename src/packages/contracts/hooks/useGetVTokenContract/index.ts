import { useProvider, useSigner } from 'packages/wallet';
import { useMemo } from 'react';
import { VToken } from 'types';

import { getVTokenContract } from 'packages/contracts/utilities/getVTokenContract';

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

import { useMemo } from 'react';

import { getVTokenContract } from 'libs/contracts/utilities/getVTokenContract';
import { useProvider, useSigner } from 'libs/wallet';
import type { VToken } from 'types';

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

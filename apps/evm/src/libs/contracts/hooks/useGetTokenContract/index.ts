import { useMemo } from 'react';

import { getTokenContract } from 'libs/contracts/utilities/getTokenContract';
import { useProvider, useSigner } from 'libs/wallet';
import type { Token } from 'types';

export interface UseGetTokenContractInput {
  token: Token;
  passSigner?: boolean;
}

export const useGetTokenContract = ({ token, passSigner = false }: UseGetTokenContractInput) => {
  const { provider } = useProvider();
  const { signer } = useSigner();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () => (signerOrProvider ? getTokenContract({ token, signerOrProvider }) : undefined),
    [signerOrProvider, token],
  );
};

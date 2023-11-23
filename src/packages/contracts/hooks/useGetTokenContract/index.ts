import { useProvider, useSigner } from 'packages/wallet';
import { useMemo } from 'react';
import { Token } from 'types';

import { getTokenContract } from 'packages/contracts/utilities/getTokenContract';

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

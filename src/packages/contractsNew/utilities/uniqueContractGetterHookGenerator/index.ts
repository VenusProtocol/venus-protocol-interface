import { Contract } from 'ethers';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

import { UniqueContractGetter } from '../uniqueContractGetterGenerator';

export interface UniqueContractGetterHookGeneratorInput<TContract extends Contract> {
  getter: UniqueContractGetter<TContract>;
}

export interface UniqueContractGetterHookInput {
  passSigner: boolean;
}

const uniqueContractGetterHookGenerator =
  <TContract extends Contract>({ getter }: UniqueContractGetterHookGeneratorInput<TContract>) =>
  (input?: UniqueContractGetterHookInput) => {
    const { signer, provider, chainId } = useAuth();
    const signerOrProvider = input?.passSigner ? signer : provider;

    return useMemo(
      () =>
        signerOrProvider
          ? getter({
              chainId,
              signerOrProvider,
            })
          : undefined,
      [signerOrProvider, chainId],
    );
  };

export default uniqueContractGetterHookGenerator;

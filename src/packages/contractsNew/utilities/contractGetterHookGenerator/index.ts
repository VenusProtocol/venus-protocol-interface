import { Contract } from 'ethers';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

import { UniqueContractGetter } from '../uniqueContractGetterGenerator';

export interface ContractGetterHookGeneratorInput<TContract extends Contract> {
  getter: UniqueContractGetter<TContract>;
}

export interface ContractGetterHookInput {
  passSigner: boolean;
}

const contractGetterHookGenerator =
  <TContract extends Contract>({ getter }: ContractGetterHookGeneratorInput<TContract>) =>
  (input?: ContractGetterHookInput) => {
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

export default contractGetterHookGenerator;

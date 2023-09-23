import { Contract } from 'ethers';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

import { GenericContractGetter } from '../genericContractGetterGenerator';

export interface GenericContractGetterHookGeneratorInput<TContract extends Contract> {
  getter: GenericContractGetter<TContract>;
}

export interface GenericContractGetterHookInput {
  address: string;
  passSigner?: boolean;
}

const genericContractGetterHookGenerator =
  <TContract extends Contract>({ getter }: GenericContractGetterHookGeneratorInput<TContract>) =>
  ({ passSigner = false, address }: GenericContractGetterHookInput) => {
    const { signer, provider } = useAuth();
    const signerOrProvider = passSigner ? signer : provider;

    return useMemo(
      () =>
        signerOrProvider
          ? getter({
              address,
              signerOrProvider,
            })
          : undefined,
      [signerOrProvider, address],
    );
  };

export default genericContractGetterHookGenerator;

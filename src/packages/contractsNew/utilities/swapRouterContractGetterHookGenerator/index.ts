import { Contract } from 'ethers';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

import { SwapRouterContractGetter } from '../swapRouterContractGetterGenerator';

export interface SwapRouterContractGetterHookGeneratorInput<TContract extends Contract> {
  getter: SwapRouterContractGetter<TContract>;
}

export interface SwapRouterContractGetterHookInput {
  comptrollerAddress: string;
  passSigner?: boolean;
}

const swapRouterContractGetterHookGenerator =
  <TContract extends Contract>({ getter }: SwapRouterContractGetterHookGeneratorInput<TContract>) =>
  ({ passSigner = false, comptrollerAddress }: SwapRouterContractGetterHookInput) => {
    const { signer, provider, chainId } = useAuth();
    const signerOrProvider = passSigner ? signer : provider;

    return useMemo(
      () =>
        signerOrProvider
          ? getter({
              chainId,
              comptrollerAddress,
              signerOrProvider,
            })
          : undefined,
      [signerOrProvider, chainId, comptrollerAddress],
    );
  };

export default swapRouterContractGetterHookGenerator;

import { Contract } from 'ethers';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

import { SwapRouterContractGetter } from '../swapRouterContractGetterGenerator';

export interface SwapRouterContractGetterHookGeneratorInput<TContract extends Contract> {
  getter: SwapRouterContractGetter<TContract>;
}

export interface SwapRouterContractGetterHookInput {
  comptrollerContractAddress: string;
  passSigner?: boolean;
}

const swapRouterContractGetterHookGenerator =
  <TContract extends Contract>({ getter }: SwapRouterContractGetterHookGeneratorInput<TContract>) =>
  ({ passSigner = false, comptrollerContractAddress }: SwapRouterContractGetterHookInput) => {
    const { signer, provider, chainId } = useAuth();
    const signerOrProvider = passSigner ? signer : provider;

    return useMemo(
      () =>
        signerOrProvider
          ? getter({
              chainId,
              comptrollerContractAddress,
              signerOrProvider,
            })
          : undefined,
      [signerOrProvider, chainId, comptrollerContractAddress],
    );
  };

export default swapRouterContractGetterHookGenerator;

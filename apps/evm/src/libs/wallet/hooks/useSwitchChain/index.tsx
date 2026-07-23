import { useCallback } from 'react';
import { useSwitchChain as useWagmiSwitchChain } from 'wagmi';

import { VError, handleError } from 'libs/errors';
import { useUpdateUrlChainId } from 'libs/wallet/hooks/useUpdateUrlChainId';
import type { ChainId } from 'types';

export const useSwitchChain = () => {
  const { switchChainAsync } = useWagmiSwitchChain();
  const { updateUrlChainId } = useUpdateUrlChainId();

  const switchChain = useCallback(
    async (input: { chainId: ChainId; callback?: () => void }) => {
      console.log(`[CHAIN_DEBUG] useSwitchChain:request | targetChainId=${input.chainId}`);
      try {
        await switchChainAsync(input);

        console.log(`[CHAIN_DEBUG] useSwitchChain:switchChainAsync:success | targetChainId=${input.chainId}`);

        // Update URL
        updateUrlChainId(input);

        input.callback?.();
      } catch (error) {
        const errorName = error instanceof Error ? error.name : typeof error;
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorCode = error instanceof VError ? error.code : 'n/a';
        console.log(
          `[CHAIN_DEBUG] useSwitchChain:error | targetChainId=${input.chainId} | name=${errorName} | code=${errorCode} | message=${errorMessage}`,
        );
        if (error instanceof VError && error.code === 'couldNotSwitchChain') {
          handleError({ error });
        }
      }
    },
    [updateUrlChainId, switchChainAsync],
  );

  return { switchChain };
};

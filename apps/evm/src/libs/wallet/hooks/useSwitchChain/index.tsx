import { useCallback } from 'react';
import { useSwitchChain as useWagmiSwitchChain } from 'wagmi';

import { VError, displayMutationError } from 'libs/errors';
import { useUpdateUrlChainId } from 'libs/wallet/hooks/useUpdateUrlChainId';
import type { ChainId } from 'types';

export const useSwitchChain = () => {
  const { switchChainAsync } = useWagmiSwitchChain();
  const { updateUrlChainId } = useUpdateUrlChainId();

  const switchChain = useCallback(
    async (input: { chainId: ChainId; callback?: () => void }) => {
      try {
        await switchChainAsync(input);

        // Update URL
        updateUrlChainId(input);

        input.callback?.();
      } catch (error) {
        if (error instanceof VError && error.code === 'couldNotSwitchChain') {
          displayMutationError({ error });
        }
      }
    },
    [updateUrlChainId, switchChainAsync],
  );

  return { switchChain };
};

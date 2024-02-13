import { VError, displayMutationError } from 'libs/errors';
import { useAccountAddress } from 'libs/wallet/hooks/useAccountAddress';
import { useUpdateUrlChainId } from 'libs/wallet/hooks/useUpdateUrlChainId';
import { useCallback } from 'react';
import { useSwitchNetwork } from 'wagmi';

import { ChainId } from 'types';

export const useSwitchChain = () => {
  const { switchNetworkAsync } = useSwitchNetwork();
  const { accountAddress } = useAccountAddress();
  const { updateUrlChainId } = useUpdateUrlChainId();

  const switchChain = useCallback(
    async (input: { chainId: ChainId; callback?: () => void }) => {
      try {
        if (switchNetworkAsync) {
          // Change wallet network if it is connected
          await switchNetworkAsync(input.chainId);
        } else if (accountAddress) {
          throw new VError({
            type: 'unexpected',
            code: 'couldNotSwitchChain',
          });
        }

        // Update URL
        updateUrlChainId(input);

        input.callback?.();
      } catch (error) {
        if (error instanceof VError && error.code === 'couldNotSwitchChain') {
          displayMutationError({ error });
        }
      }
    },
    [accountAddress, updateUrlChainId, switchNetworkAsync],
  );

  return { switchChain };
};

import { useCallback } from 'react';
import { useSwitchNetwork } from 'wagmi';

import { VError, displayMutationError } from 'packages/errors';
import { useAccountAddress } from 'packages/wallet/hooks/useAccountAddress';
import { useUpdateUrlChainId } from 'packages/wallet/hooks/useUpdateUrlChainId';
import { ChainId } from 'types';

export const useSwitchChain = () => {
  const { switchNetworkAsync } = useSwitchNetwork();
  const { accountAddress } = useAccountAddress();
  const { updateUrlChainId } = useUpdateUrlChainId();

  const switchChain = useCallback(
    async (input: { chainId: ChainId }) => {
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

import { useCallback } from 'react';
import { useSwitchNetwork } from 'wagmi';

import { VError, displayMutationError } from 'packages/errors';
import { useAccountAddress } from 'packages/wallet/hooks/useAccountAddress';
import { store } from 'packages/wallet/store';
import { ChainId } from 'types';

export const useSwitchChain = () => {
  const { switchNetworkAsync } = useSwitchNetwork();
  const { accountAddress } = useAccountAddress();
  const setStoreChainId = store.use.setChainId();

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

        // Update store
        setStoreChainId(input);
      } catch (error) {
        if (error instanceof VError && error.code === 'couldNotSwitchChain') {
          displayMutationError({ error });
        }
      }
    },
    [accountAddress, setStoreChainId, switchNetworkAsync],
  );

  return { switchChain };
};

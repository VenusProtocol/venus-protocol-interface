import { VError, displayMutationError } from 'errors';
import { store } from 'packages/wallet/store';
import { useCallback } from 'react';
import { ChainId } from 'types';
import { useSwitchNetwork } from 'wagmi';

import { useAccountAddress } from 'packages/wallet/hooks/useAccountAddress';

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

  return switchChain;
};

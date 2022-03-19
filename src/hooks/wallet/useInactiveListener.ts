import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../utilities/connectors';

export default function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ethereum' does not exist on type 'Window... Remove this comment to see the full error message
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress && !process.env.STORYBOOK) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch(err => {
          console.error('Failed to activate after chain changed', err);
        });
      };

      const handleAccountsChanged = (accounts: $TSFixMe) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch(err => {
            console.error('Failed to activate after accounts changed', err);
          });
        }
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
}

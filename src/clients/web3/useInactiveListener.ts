import { useEffect } from 'react';
import { useWeb3Account } from 'clients/web3';

import { injectedConnector } from './connectors';

const useInactiveListener = (suppress = false) => {
  const { active, error, activate } = useWeb3Account();

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && 'on' in ethereum && !active && !error && !suppress && !process.env.STORYBOOK) {
      const handleChainChanged = () => {
        // eat errors
        activate(injectedConnector, undefined, true).catch(err => {
          console.error('Failed to activate after chain changed', err);
        });
      };

      const handleAccountsChanged = (accounts: $TSFixMe) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injectedConnector, undefined, true).catch(err => {
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
};

export default useInactiveListener;

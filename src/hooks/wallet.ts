import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utilities/connectors';
import { LS_KEY_IS_USER_LOGGED_IN } from '../config';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  // Only try to connect if we are not running the storybook
  const [tried, setTried] = useState(!process.env.STORYBOOK);

  useEffect(() => {
    const init = async () => {
      // Check if user previously connected their wallet with the dApp
      const isUserConnected = window.localStorage.getItem(LS_KEY_IS_USER_LOGGED_IN);
      if (!isUserConnected) {
        return;
      }

      // Check if user previously connected their wallet with the dApp
      const isAuthorized = await injected.isAuthorized();
      if (!isAuthorized) {
        setTried(true);
        return;
      }

      // Fetch user account details
      try {
        await activate(injected, undefined, true);
      } catch {
        // TODO: handle error (?)
        setTried(true);
      }
    };

    init();
  }, []); //eslint-disable-line
  // intentionally only running on mount(make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
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

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utilities/connectors';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  // Only try to connect if we are not running the storybook
  const [tried, setTried] = useState(!process.env.STORYBOOK);

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
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

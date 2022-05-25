import { useState, useEffect } from 'react';
import { useWeb3Account } from 'clients/web3';

import { LS_KEY_CONNECTED_CONNECTOR } from 'config';
import { injectedConnector } from './connectors';

const useEagerConnect = () => {
  const { activate, active } = useWeb3Account();
  // Only try to connect if we are not running the storybook
  const [tried, setTried] = useState(!process.env.STORYBOOK);

  useEffect(() => {
    const init = async () => {
      // Check if user previously connected their wallet with the dApp
      const connectedConnector = window.localStorage.getItem(LS_KEY_CONNECTED_CONNECTOR);
      if (!connectedConnector) {
        return;
      }

      // Check if user previously connected their wallet with the dApp
      const isAuthorized = await injectedConnector.isAuthorized();
      if (!isAuthorized) {
        setTried(true);
        return;
      }

      // Fetch user account details
      try {
        await activate(injectedConnector, undefined, true);
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
};

export default useEagerConnect;

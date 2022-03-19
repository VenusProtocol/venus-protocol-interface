import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../utilities/connectors';
import { LS_KEY_IS_USER_LOGGED_IN } from '../../config';

export default function useEagerConnect() {
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

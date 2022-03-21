import React, { useState, useEffect } from 'react';
import { useWeb3Account } from 'clients/web3';

import useEagerConnect from '../useEagerConnect';
import useInactiveListener from '../useInactiveListener';

const Web3ReactManager: React.FC = ({ children }) => {
  const context = useWeb3Account();
  const {
    connector,
    chainId,
    active,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'networkError' does not exist on type 'We... Remove this comment to see the full error message
    networkError,
  } = context;
  const triedEager = useEagerConnect();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector, chainId]);

  // when there's no account connected, react to logins (broadly speaking) on
  // the injected provider, if it exists
  useInactiveListener(!triedEager);

  // on page load, do nothing until we've tried to connect to the injected
  // connector
  if (!triedEager) {
    return null;
  }

  // if the account context isn't active, and there's an error on the network
  // context, it's an irrecoverable error
  if (!active && networkError) {
    // TODO: log error to Sentry
    return <>An internal error occurred. Please try again later.</>;
  }

  return <>{children}</>;
};

export default Web3ReactManager;

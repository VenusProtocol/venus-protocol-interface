import { setTag, setUser } from '@sentry/react';
import React, { useEffect } from 'react';

import { useAuth } from 'context/AuthContext';

export const SentryErrorInfo: React.FC = () => {
  const { accountAddress, chainId } = useAuth();

  // Enriches Sentry events with info about the user and chain
  useEffect(() => {
    if (accountAddress) {
      setUser({
        id: accountAddress,
      });
    } else {
      setUser(null);
    }

    setTag('chainId', chainId);
  }, [accountAddress, chainId]);

  return null;
};

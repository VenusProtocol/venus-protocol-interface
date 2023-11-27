import { setTag, setUser } from '@sentry/react';
import { useAccountAddress, useChainId } from 'packages/wallet';
import React, { useEffect } from 'react';

export const SentryErrorInfo: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();

  // Enriches Sentry events with info about the user and chain
  useEffect(() => {
    if (accountAddress) {
      setUser({
        id: accountAddress,
      });
    } else {
      setUser(null);
    }
  }, [accountAddress]);

  useEffect(() => {
    setTag('chainId', chainId);
  }, [chainId]);

  return null;
};

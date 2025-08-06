import { useAccountAddress } from 'libs/wallet';
import { useEffect, useRef } from 'react';
import type { Address } from 'viem';
import { useAuthAnalyticVariantContext } from '../../context';
import { useAnalytics } from '../../useAnalytics';

export const WalletAnalyticSender: React.FC = () => {
  const { captureAnalyticEvent } = useAnalytics();
  const { accountAddress } = useAccountAddress();
  const { authAnalyticVariant } = useAuthAnalyticVariantContext();

  const connectionDetectedRef = useRef(false);
  const previousAccountAddressRef = useRef<Address>(undefined);

  // Detect wallet connection/disconnection and send analytic event
  useEffect(() => {
    if (accountAddress && !connectionDetectedRef.current) {
      captureAnalyticEvent('wallet_connected', {
        variant: authAnalyticVariant || 'auto_connect',
      });

      connectionDetectedRef.current = true;
    }

    if (!accountAddress && connectionDetectedRef.current) {
      captureAnalyticEvent('wallet_disconnected', {});

      connectionDetectedRef.current = false;
    }
  }, [accountAddress, captureAnalyticEvent, authAnalyticVariant]);

  // Detect wallet address switch
  useEffect(() => {
    if (
      accountAddress &&
      previousAccountAddressRef.current &&
      accountAddress !== previousAccountAddressRef.current
    ) {
      captureAnalyticEvent('wallet_switched', {});
    }

    previousAccountAddressRef.current = accountAddress;
  }, [accountAddress, captureAnalyticEvent]);

  return null;
};

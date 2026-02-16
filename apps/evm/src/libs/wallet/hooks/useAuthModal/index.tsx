import { useConnectModal } from '@rainbow-me/rainbowkit';

import { useAnalytics } from 'libs/analytics';
import { useEffect } from 'react';

export const useAuthModal = () => {
  const { captureAnalyticEvent, authAnalyticVariant, setAuthAnalyticVariant } = useAnalytics();

  const { openConnectModal, connectModalOpen } = useConnectModal();

  useEffect(() => {
    if (!connectModalOpen && authAnalyticVariant) {
      setAuthAnalyticVariant(undefined);
    }
  }, [connectModalOpen, authAnalyticVariant, setAuthAnalyticVariant]);

  return {
    isAuthModalOpen: connectModalOpen,
    openAuthModal: ({ analyticVariant: inputAnalyticVariant }: { analyticVariant?: string }) => {
      setAuthAnalyticVariant(inputAnalyticVariant);

      captureAnalyticEvent('connect_wallet_initiated', {
        variant: inputAnalyticVariant,
      });

      openConnectModal?.();
    },
  };
};

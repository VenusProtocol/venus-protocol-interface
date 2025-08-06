import { useModal } from 'connectkit';

import { useAnalytics } from 'libs/analytics';

export const useAuthModal = () => {
  const { captureAnalyticEvent, authAnalyticVariant, setAuthAnalyticVariant } = useAnalytics();

  const { open, setOpen } = useModal({
    onDisconnect: () => {
      if (authAnalyticVariant) {
        setAuthAnalyticVariant(undefined);
      }
    },
  });

  return {
    isAuthModalOpen: open,
    openAuthModal: ({ analyticVariant: inputAnalyticVariant }: { analyticVariant?: string }) => {
      setAuthAnalyticVariant(inputAnalyticVariant);

      captureAnalyticEvent('connect_wallet_initiated', {
        variant: inputAnalyticVariant,
      });

      setOpen(true);
    },
    closeAuthModal: () => {
      setAuthAnalyticVariant(undefined);

      setOpen(false);
    },
  };
};

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

import { useAnalytics } from 'libs/analytics';
import { useEffect, useRef } from 'react';

const LOG_PREFIX = '[WalletConnectDebug]';

export const useAuthModal = () => {
  const { captureAnalyticEvent, authAnalyticVariant, setAuthAnalyticVariant } = useAnalytics();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { isConnected, address, status, connector } = useAccount();
  const previousModalStateRef = useRef(connectModalOpen);
  const previousConnectionStateRef = useRef({ isConnected, address, status });

  useEffect(() => {
    if (previousModalStateRef.current !== connectModalOpen) {
      console.log(`${LOG_PREFIX} Modal state changed:`, {
        previous: previousModalStateRef.current,
        current: connectModalOpen,
        timestamp: new Date().toISOString(),
      });
      previousModalStateRef.current = connectModalOpen;
    }
  }, [connectModalOpen]);

  useEffect(() => {
    const prev = previousConnectionStateRef.current;
    if (
      prev.isConnected !== isConnected ||
      prev.address !== address ||
      prev.status !== status
    ) {
      console.log(`${LOG_PREFIX} Connection state changed:`, {
        previous: {
          isConnected: prev.isConnected,
          address: prev.address,
          status: prev.status,
        },
        current: {
          isConnected,
          address,
          status,
          connectorId: connector?.id,
          connectorName: connector?.name,
          connectorType: connector?.type,
        },
        modalOpen: connectModalOpen,
        timestamp: new Date().toISOString(),
      });

      if (connectModalOpen && isConnected && address && status === 'connected') {
        console.warn(`${LOG_PREFIX} ⚠️ STATE SYNC ISSUE DETECTED:`, {
          message: 'Wallet is connected but modal is still open',
          isConnected,
          address,
          status,
          modalOpen: connectModalOpen,
          connectorId: connector?.id,
          connectorType: connector?.type,
          timestamp: new Date().toISOString(),
        });
      }

      previousConnectionStateRef.current = { isConnected, address, status };
    }
  }, [isConnected, address, status, connectModalOpen, connector]);

  useEffect(() => {
    if (!connectModalOpen && authAnalyticVariant) {
      setAuthAnalyticVariant(undefined);
    }
  }, [connectModalOpen, authAnalyticVariant, setAuthAnalyticVariant]);

  return {
    isAuthModalOpen: connectModalOpen,
    openAuthModal: ({ analyticVariant: inputAnalyticVariant }: { analyticVariant?: string }) => {
      console.log(`${LOG_PREFIX} openAuthModal called:`, {
        analyticVariant: inputAnalyticVariant,
        currentConnectionState: {
          isConnected,
          address,
          status,
          connectorId: connector?.id,
          connectorType: connector?.type,
        },
        currentModalState: connectModalOpen,
        timestamp: new Date().toISOString(),
      });

      setAuthAnalyticVariant(inputAnalyticVariant);

      captureAnalyticEvent('connect_wallet_initiated', {
        variant: inputAnalyticVariant,
      });

      openConnectModal?.();
    },
  };
};

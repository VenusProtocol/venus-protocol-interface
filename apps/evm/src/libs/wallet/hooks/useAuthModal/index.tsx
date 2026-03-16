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
      console.log(`${LOG_PREFIX} Modal: ${previousModalStateRef.current} -> ${connectModalOpen}`);
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
      console.log(`${LOG_PREFIX} Connection: ${prev.status}(${prev.address || 'none'}) -> ${status}(${address || 'none'}) | Modal: ${connectModalOpen} | Connector: ${connector?.id || 'none'}`);

      if (connectModalOpen && isConnected && address && status === 'connected') {
        console.warn(`${LOG_PREFIX} ⚠️ SYNC ISSUE: Connected but modal still open | Address: ${address} | Connector: ${connector?.id}`);
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
      console.log(`${LOG_PREFIX} openAuthModal | Variant: ${inputAnalyticVariant} | Current: ${status}(${address || 'none'}) | Modal: ${connectModalOpen}`);

      setAuthAnalyticVariant(inputAnalyticVariant);

      captureAnalyticEvent('connect_wallet_initiated', {
        variant: inputAnalyticVariant,
      });

      openConnectModal?.();
    },
  };
};

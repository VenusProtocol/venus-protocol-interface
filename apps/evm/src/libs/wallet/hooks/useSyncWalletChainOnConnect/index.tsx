import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';

import config from 'config';
import { useAccountChainId } from '../useAccountChainId';
import { useChainId } from '../useChainId';
import { useSwitchChain } from '../useSwitchChain';

export const useSyncWalletChainOnConnect = () => {
  const { chainId: appChainId } = useChainId();
  const { chainId: walletChainId } = useAccountChainId();
  const { status } = useAccount();
  const { connectModalOpen } = useConnectModal();
  const { switchChain } = useSwitchChain();

  const appChainIdRef = useRef(appChainId);
  appChainIdRef.current = appChainId;

  const userConnectPendingRef = useRef(false);

  useEffect(() => {
    if (connectModalOpen) {
      userConnectPendingRef.current = true;
    }
  }, [connectModalOpen]);

  useEffect(() => {
    if (config.isSafeApp) {
      return;
    }

    if (status !== 'connected' || walletChainId === undefined) {
      return;
    }

    if (!userConnectPendingRef.current) {
      return;
    }
    userConnectPendingRef.current = false;

    if (walletChainId === appChainIdRef.current) {
      return;
    }

    switchChain({ chainId: appChainIdRef.current });
  }, [status, walletChainId, switchChain]);
};

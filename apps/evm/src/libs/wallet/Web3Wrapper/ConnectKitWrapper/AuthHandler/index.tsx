import { disconnect, getAccount, watchAccount } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useDisconnect } from 'wagmi';

import { routes } from 'constants/routing';
import { useNavigate } from 'hooks/useNavigate';
import { getUnsafeChainIdFromSearchParams } from 'libs/wallet';
import { chains, defaultChain } from 'libs/wallet/chains';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import { useUpdateUrlChainId } from 'libs/wallet/hooks/useUpdateUrlChainId';
import { getChainId } from 'libs/wallet/utilities/getChainId';
import config from './config';

export const AuthHandler: React.FC = () => {
  const { disconnectAsync } = useDisconnect();
  const { updateUrlChainId } = useUpdateUrlChainId();
  const { navigate } = useNavigate();

  const location = useLocation();
  const initialLocationRef = useRef(location);
  const navigateRef = useRef(navigate);
  const [searchParams] = useSearchParams();

  // Initialize wallet connection on mount
  useEffect(() => {
    const walletChain = getAccount(config).chain;

    // Redirect to account page if user is visiting dashboard and if they didn't just reload
    // the dApp
    if (
      walletChain &&
      initialLocationRef.current.pathname === routes.dashboard.path &&
      window.history.length <= 2
    ) {
      navigateRef.current(
        {
          pathname: routes.account.path,
          search: `?${CHAIN_ID_SEARCH_PARAM}=${walletChain.id || defaultChain.id}`,
        },
        { replace: true },
      );
    }
  }, []);

  // Detect change of chain ID triggered from wallet
  useEffect(() => {
    const stopWatchingNetwork = watchAccount(config, {
      onChange: async ({ chain: walletChain }) => {
        if (!walletChain) {
          await disconnect(config);
          return;
        }

        // Update URL when wallet connects to a different chain
        const { chainId } = getChainId();

        if (walletChain.id !== chainId) {
          updateUrlChainId({ chainId: walletChain.id });
        }
      },
    });

    return stopWatchingNetwork;
  }, [updateUrlChainId]);

  // Detect change of chain ID triggered from URL
  useEffect(() => {
    const fn = async () => {
      const { chainId: unsafeSearchParamChainId } = getUnsafeChainIdFromSearchParams({
        searchParams,
      });

      const walletChain = getAccount(config).chain;

      // Update URL again if it was updated with an unsupported chain ID or does not contain any
      // chain ID search param
      if (
        unsafeSearchParamChainId === undefined ||
        !chains.some(chain => chain.id === unsafeSearchParamChainId)
      ) {
        updateUrlChainId({ chainId: walletChain?.id ?? defaultChain.id });
        return;
      }

      // Disconnect wallet if chain ID changed in URL but wallet is connected to a different network
      if (walletChain && walletChain.id !== unsafeSearchParamChainId) {
        await disconnectAsync();
      }
    };

    fn();
  }, [searchParams, updateUrlChainId, disconnectAsync]);

  return null;
};

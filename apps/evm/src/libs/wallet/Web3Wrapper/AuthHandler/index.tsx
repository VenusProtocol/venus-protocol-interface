import { getNetwork, watchNetwork } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { useConfig, useDisconnect } from 'wagmi';

import { routes } from 'constants/routing';
import { useNavigate } from 'hooks/useNavigate';
import { getUnsafeChainIdFromSearchParams } from 'libs/wallet';
import { chains, defaultChain } from 'libs/wallet/chains';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import { useUpdateUrlChainId } from 'libs/wallet/hooks/useUpdateUrlChainId';
import { getChainId } from 'libs/wallet/utilities/getChainId';

export const AuthHandler: React.FC = () => {
  const config = useConfig();
  const { disconnectAsync } = useDisconnect();
  const { updateUrlChainId } = useUpdateUrlChainId();
  const { navigate } = useNavigate();

  const location = useLocation();
  const initialLocationRef = useRef(location);
  const navigateRef = useRef(navigate);
  const disconnectAsyncRef = useRef(disconnectAsync);
  const [searchParams] = useSearchParams();
  const hasInitializedRef = useRef(false);

  // Initialize wallet connection on mount
  useEffect(() => {
    const fn = async () => {
      // Automatically connect wallet on mount if it is already linked with the dApp. This is a
      // workaround to prevent an issue where a locked wallet extension returns an account address
      // but no signer. By setting the autoConnect property of wagmi's config to false and manually
      // triggering the autoConnect function, locked wallets will be automatically detected as being
      // disconnected
      const connector = await config.autoConnect();
      const { chainId } = getChainId();

      // Disconnect wallet if it's connected to a different chain than the one set through URL
      if (connector?.chain?.id && connector.chain.id !== chainId) {
        await disconnectAsyncRef.current();
      } else if (
        !!connector?.account &&
        initialLocationRef.current.pathname === routes.dashboard.path &&
        window.history.length <= 2
      ) {
        // Redirect to account page if user is visiting dashboard and if they didn't just reload
        // the dApp
        navigateRef.current(
          {
            pathname: routes.account.path,
            search: `?${CHAIN_ID_SEARCH_PARAM}=${connector?.chain?.id || defaultChain.id}`,
          },
          { replace: true },
        );
      }

      hasInitializedRef.current = true;
    };

    fn();
  }, [config]);

  // Detect change of chain ID triggered from wallet
  useEffect(() => {
    const stopWatchingNetwork = watchNetwork(async ({ chain: walletChain }) => {
      if (!walletChain || !hasInitializedRef.current) {
        return;
      }

      // Disconnect wallet if it connected to an unsupported chain
      if (walletChain.unsupported) {
        await disconnectAsync();
        return;
      }

      // Update URL when wallet connects to a different chain
      const { chainId } = getChainId();

      if (walletChain.id !== chainId) {
        updateUrlChainId({ chainId: walletChain.id });
      }
    });

    return stopWatchingNetwork;
  }, [disconnectAsync, updateUrlChainId]);

  // Detect change of chain ID triggered from URL
  useEffect(() => {
    const fn = async () => {
      if (!hasInitializedRef.current) {
        return;
      }

      const { chain: walletChain } = getNetwork();
      const { chainId: unsafeSearchParamChainId } = getUnsafeChainIdFromSearchParams({
        searchParams,
      });

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
      if (walletChain?.id !== unsafeSearchParamChainId) {
        await disconnectAsync();
      }
    };

    fn();
  }, [searchParams, updateUrlChainId, disconnectAsync]);

  return null;
};

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useConfig, useDisconnect, useNetwork } from 'wagmi';

import { routes } from 'constants/routing';
import { useNavigate } from 'hooks/useNavigate';
import { defaultChain } from 'packages/wallet/chains';
import { CHAIN_ID_SEARCH_PARAM } from 'packages/wallet/constants';
import { useUpdateUrlChainId } from 'packages/wallet/hooks/useUpdateUrlChainId';
import { getChainId } from 'packages/wallet/utilities/getChainId';

export const AuthHandler: React.FC = () => {
  const config = useConfig();
  const { chain: walletChain } = useNetwork();
  const { disconnectAsync } = useDisconnect();
  const { updateUrlChainId } = useUpdateUrlChainId();
  const { navigate } = useNavigate();

  const location = useLocation();
  const initialLocationRef = useRef(location);
  const navigateRef = useRef(navigate);
  const disconnectAsyncRef = useRef(disconnectAsync);
  const hasInitializedRef = useRef(false);

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

  useEffect(() => {
    const fn = async () => {
      if (!walletChain || !hasInitializedRef.current) {
        return;
      }

      // Disconnect wallet if it connected to an unsupported chain
      if (walletChain.unsupported) {
        await disconnectAsync();
        return;
      }

      // Update URL when wallet connects to a different chain or if URL is manually changed
      const { chainId } = getChainId();
      if (walletChain.id !== chainId) {
        updateUrlChainId({ chainId: walletChain.id });
      }
    };

    fn();
  }, [walletChain, updateUrlChainId, disconnectAsync]);

  return null;
};

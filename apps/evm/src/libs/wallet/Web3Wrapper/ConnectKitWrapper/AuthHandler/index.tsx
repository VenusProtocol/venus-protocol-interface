import { getAccount } from '@wagmi/core';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { routes } from 'constants/routing';
import { useNavigate } from 'hooks/useNavigate';
import { getUnsafeChainIdFromSearchParams } from 'libs/wallet';
import config from 'libs/wallet/Web3Wrapper/config';
import { chains, defaultChain } from 'libs/wallet/chains';
import { CHAIN_ID_SEARCH_PARAM } from 'libs/wallet/constants';
import { useUpdateUrlChainId } from 'libs/wallet/hooks/useUpdateUrlChainId';

export const AuthHandler: React.FC = () => {
  const { updateUrlChainId } = useUpdateUrlChainId();
  const { navigate } = useNavigate();

  const location = useLocation();
  const initialLocationRef = useRef(location);
  const navigateRef = useRef(navigate);
  const [searchParams] = useSearchParams();

  // Initialize wallet connection on mount
  useEffect(() => {
    const { chain: walletChain } = getAccount(config);

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

  // Detect change of chain ID triggered from URL
  useEffect(() => {
    const fn = async () => {
      const { chainId: unsafeSearchParamChainId } = getUnsafeChainIdFromSearchParams({
        searchParams,
      });

      // Update URL if it was updated with an unsupported chain ID or does not contain any chain ID
      // search param
      if (
        unsafeSearchParamChainId === undefined ||
        !chains.some(chain => chain.id === unsafeSearchParamChainId)
      ) {
        updateUrlChainId({ chainId: defaultChain.id });
      }
    };

    fn();
  }, [searchParams, updateUrlChainId]);

  return null;
};

import { useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { getUnsafeChainIdFromSearchParams } from 'libs/wallet';
import { chains, defaultChain } from 'libs/wallet/chains';
import { useUpdateUrlChainId } from 'libs/wallet/hooks/useUpdateUrlChainId';

export const AuthHandler: React.FC = () => {
  const { updateUrlChainId } = useUpdateUrlChainId();
  const [searchParams] = useSearchParams();

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

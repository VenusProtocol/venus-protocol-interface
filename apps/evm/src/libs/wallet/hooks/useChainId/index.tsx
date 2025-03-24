import type { ChainId } from '@venusprotocol/chains';
import config from 'config';
import { chains, defaultChain } from 'libs/wallet/chains';
import { getUnsafeChainIdFromSearchParams } from 'libs/wallet/utilities/getUnsafeChainIdFromSearchParams';
import { useSearchParams } from 'react-router-dom';
import { useAccountChainId } from '../useAccountChainId';

export const useChainId = () => {
  const [searchParams] = useSearchParams();
  const { chainId: accountChainId } = useAccountChainId();
  const { chainId: searchParamsChainId } = getUnsafeChainIdFromSearchParams({ searchParams });

  // When running in the Safe Wallet app it is responsible for the active chain
  let chainId = config.isSafeApp ? accountChainId : searchParamsChainId;

  if (!chainId || !chains.some(chain => chain.id === chainId)) {
    chainId = defaultChain.id;
  }

  return {
    chainId: chainId as ChainId,
  };
};

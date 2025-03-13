import getApiTokenPrice from 'clients/api/queries/getApiTokenPrice';
import { useChainId } from 'libs/wallet';
import { useCallback } from 'react';

const useGetApiTokenPrice = () => {
  const { chainId } = useChainId();

  return useCallback(
    (tokenAddresses: string[]) => getApiTokenPrice({ tokenAddresses, chainId }),
    [chainId],
  );
};

export default useGetApiTokenPrice;

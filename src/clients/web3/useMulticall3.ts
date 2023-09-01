import { Multicall as Multicall3 } from 'ethereum-multicall';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';
import { logError } from 'context/ErrorLogger';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

const useMulticall3 = () => {
  const { provider } = useAuth();
  const multicall3ContractAddress = useGetUniqueContractAddress({
    name: 'multicall3',
  });

  return useMemo(() => {
    if (!multicall3ContractAddress) {
      // eslint-disable-next-line no-underscore-dangle
      logError(`Multicall3 contract address missing on chain with ID ${provider._network.chainId}`);
    }

    return new Multicall3({
      ethersProvider: provider,
      tryAggregate: true,
      multicallCustomContractAddress: multicall3ContractAddress,
    });
  }, [provider, multicall3ContractAddress]);
};

export default useMulticall3;

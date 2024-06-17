import { getVTreasuryContractAddress, getVTreasuryV8ContractAddress } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { useMemo } from 'react';
import { ChainId } from 'types';

export const useGetVTreasuryContractAddress = () => {
  const { chainId } = useChainId();

  return useMemo(
    () =>
      chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
        ? getVTreasuryContractAddress({ chainId })
        : getVTreasuryV8ContractAddress({ chainId }),
    [chainId],
  );
};

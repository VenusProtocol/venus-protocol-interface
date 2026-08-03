import { getContractAddress } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';

export const useGetVTreasuryContractAddress = () => {
  const { chainId } = useChainId();

  return getContractAddress({
    name:
      chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
        ? 'VTreasury'
        : 'VTreasuryV8',
    chainId,
  });
};

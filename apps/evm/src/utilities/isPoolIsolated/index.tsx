import { ChainId, chainMetadata } from '@venusprotocol/registry';
import areAddressesEqual from 'utilities/areAddressesEqual';

export const isPoolIsolated = ({
  chainId,
  comptrollerAddress,
}: { chainId: ChainId; comptrollerAddress: string }) => {
  const { corePoolComptrollerContractAddress } = chainMetadata[chainId];

  return (
    (chainId !== ChainId.BSC_MAINNET && chainId !== ChainId.BSC_TESTNET) ||
    !areAddressesEqual(corePoolComptrollerContractAddress, comptrollerAddress)
  );
};

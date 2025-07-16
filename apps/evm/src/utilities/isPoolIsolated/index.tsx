import { ChainId, chainMetadata } from '@venusprotocol/chains';
import areAddressesEqual from 'utilities/areAddressesEqual';

export const isPoolIsolated = ({
  chainId,
  comptrollerAddress,
}: { chainId: ChainId; comptrollerAddress: string }) => {
  const { corePoolComptrollerContractAddress } = chainMetadata[chainId];

  return (
    (chainId !== ChainId.BSC_MAINNET && chainId !== ChainId.BSC_TESTNET) ||
    (!!corePoolComptrollerContractAddress &&
      !areAddressesEqual(corePoolComptrollerContractAddress, comptrollerAddress))
  );
};

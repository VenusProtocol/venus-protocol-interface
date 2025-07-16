import type { ChainId } from '@venusprotocol/chains/types';
import type { Address, PublicClient } from 'viem';

import type { ImportableProtocol, ImportableSupplyPosition } from 'types';
import { getImportableAaveSupplyPositions } from './getImportableAaveSupplyPositions';
import { getImportableMorphoSupplyPositions } from './getImportableMorphoSupplyPositions';

// TODO: update tests

export interface GetImportablePositionsInput {
  accountAddress: Address;
  chainId: ChainId;
  publicClient: PublicClient;
  protocols: ImportableProtocol[];
  aaveUiPoolDataProviderContractAddress?: Address;
  aavePoolAddressesProviderContractAddress?: Address;
}

export type GetImportablePositionsOutput = {
  [protocol in ImportableProtocol]: ImportableSupplyPosition[];
};

export const getImportablePositions = async ({
  accountAddress,
  publicClient,
  chainId,
  protocols,
  aaveUiPoolDataProviderContractAddress,
  aavePoolAddressesProviderContractAddress,
}: GetImportablePositionsInput): Promise<GetImportablePositionsOutput> => {
  const [importableAaveSupplyPositions, importableMorphoSupplyPositions] = await Promise.all([
    aavePoolAddressesProviderContractAddress &&
    aaveUiPoolDataProviderContractAddress &&
    protocols.includes('aave')
      ? getImportableAaveSupplyPositions({
          accountAddress,
          publicClient,
          aaveUiPoolDataProviderContractAddress,
          aavePoolAddressesProviderContractAddress,
        })
      : undefined,
    protocols.includes('morpho')
      ? getImportableMorphoSupplyPositions({
          chainId,
          accountAddress,
          publicClient,
        })
      : undefined,
  ]);

  return {
    aave: importableAaveSupplyPositions?.importableSupplyPositions || [],
    morpho: importableMorphoSupplyPositions?.importableSupplyPositions || [],
  };
};

import type { Address, PublicClient } from 'viem';

import type { ImportableProtocol, ImportableSupplyPosition } from 'types';
import { getImportableAaveSupplyPositions } from './getImportableAaveSupplyPositions';

export interface GetImportablePositionsInput {
  accountAddress: Address;
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
  protocols,
  aaveUiPoolDataProviderContractAddress,
  aavePoolAddressesProviderContractAddress,
}: GetImportablePositionsInput): Promise<GetImportablePositionsOutput> => {
  const [importableAaveSupplyPositions] = await Promise.all([
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
  ]);

  return {
    aave: importableAaveSupplyPositions?.importableSupplyPositions || [],
  };
};

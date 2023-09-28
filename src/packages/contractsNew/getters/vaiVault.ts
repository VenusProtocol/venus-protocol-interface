/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/VaiVault.json';
import { VaiVault } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getVaiVaultContract = uniqueContractGetterGenerator<VaiVault>({
  name: 'VaiVault',
  abi,
});

export const useGetVaiVaultContract = uniqueContractGetterHookGenerator({
  getter: getVaiVaultContract,
});

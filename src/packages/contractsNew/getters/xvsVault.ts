/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/XvsVault.json';
import { XvsVault } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getXvsVaultContract = uniqueContractGetterGenerator<XvsVault>({
  name: 'XvsVault',
  abi,
});

export const useGetXvsVaultContract = uniqueContractGetterHookGenerator({
  getter: getXvsVaultContract,
});

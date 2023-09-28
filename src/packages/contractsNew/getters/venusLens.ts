/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/VenusLens.json';
import { VenusLens } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getVenusLensContract = uniqueContractGetterGenerator<VenusLens>({
  name: 'VenusLens',
  abi,
});

export const useGetVenusLensContract = uniqueContractGetterHookGenerator({
  getter: getVenusLensContract,
});

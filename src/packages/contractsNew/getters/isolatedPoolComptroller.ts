/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/IsolatedPoolComptroller.json';
import { IsolatedPoolComptroller } from 'packages/contractsNew/infos/contractTypes';

import genericContractGetterGenerator from 'packages/contractsNew/utilities/genericContractGetterGenerator';
import genericContractGetterHookGenerator from 'packages/contractsNew/utilities/genericContractGetterHookGenerator';

export const getIsolatedPoolComptrollerContract =
  genericContractGetterGenerator<IsolatedPoolComptroller>({
    abi,
  });

export const useGetIsolatedPoolComptrollerContract = genericContractGetterHookGenerator({
  getter: getIsolatedPoolComptrollerContract,
});

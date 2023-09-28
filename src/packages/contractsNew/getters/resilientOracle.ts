/* Automatically generated file, do not update manually */
import abi from 'packages/contractsNew/infos/abis/ResilientOracle.json';
import { ResilientOracle } from 'packages/contractsNew/infos/contractTypes';

import uniqueContractGetterGenerator from 'packages/contractsNew/utilities/uniqueContractGetterGenerator';
import uniqueContractGetterHookGenerator from 'packages/contractsNew/utilities/uniqueContractGetterHookGenerator';

export const getResilientOracleContract = uniqueContractGetterGenerator<ResilientOracle>({
  name: 'ResilientOracle',
  abi,
});

export const useGetResilientOracleContract = uniqueContractGetterHookGenerator({
  getter: getResilientOracleContract,
});

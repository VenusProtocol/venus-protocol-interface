import type { JsonFragment } from '@ethersproject/abi';
import { abi as isolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';

import { Comptroller as IsolatedPoolComptroller } from '../types/contracts/isolatedPools';

export interface GenericContractInfo {
  abi: JsonFragment[];
}

const isolatedPoolComptroller: GenericContractInfo = {
  abi: isolatedPoolComptrollerAbi,
};

const genericContractInfos = {
  isolatedPoolComptroller,
};

export type GenericContractName = keyof typeof genericContractInfos;

export type GenericContractTypes = {
  isolatedPoolComptroller: IsolatedPoolComptroller;
};

export type GenericContractTypeByName<TContractName extends GenericContractName> =
  GenericContractTypes[TContractName];

export default genericContractInfos;

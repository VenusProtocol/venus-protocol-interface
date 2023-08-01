import type { JsonFragment } from '@ethersproject/abi';
import { abi as isolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as rewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';

import {
  Comptroller as IsolatedPoolComptroller,
  RewardsDistributor,
} from '../types/contracts/isolatedPools';

export interface GenericContractInfo {
  abi: JsonFragment[];
}

const isolatedPoolComptroller: GenericContractInfo = {
  abi: isolatedPoolComptrollerAbi,
};

const rewardsDistributor: GenericContractInfo = {
  abi: rewardsDistributorAbi,
};

const genericContractInfos = {
  isolatedPoolComptroller,
  rewardsDistributor,
};

export type GenericContractName = keyof typeof genericContractInfos;

export type GenericContractTypes = {
  isolatedPoolComptroller: IsolatedPoolComptroller;
  rewardsDistributor: RewardsDistributor;
};

export type GenericContractTypeByName<TContractName extends GenericContractName> =
  GenericContractTypes[TContractName];

export default genericContractInfos;

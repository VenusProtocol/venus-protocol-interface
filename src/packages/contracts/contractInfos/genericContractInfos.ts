import type { JsonFragment } from '@ethersproject/abi';
import { abi as isolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as jumpRateModelV2Abi } from '@venusprotocol/isolated-pools/artifacts/contracts/JumpRateModelV2.sol/JumpRateModelV2.json';
import { abi as rewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { abi as vTokenAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/VToken.sol/VToken.json';
import { abi as jumpRateModelAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/InterestRateModels/JumpRateModel.sol/JumpRateModel.json';

import {
  Comptroller as IsolatedPoolComptroller,
  JumpRateModelV2,
  RewardsDistributor,
  VToken,
} from '../types/contracts/isolatedPools';
import { Bep20, PancakePairV2 } from '../types/contracts/others';
import { JumpRateModel } from '../types/contracts/venusProtocol';

import bep20Abi from './externalAbis/bep20.json';
import pancakePairV2Abi from './externalAbis/pancakePairV2.json';

export interface GenericContractInfo {
  abi: JsonFragment[];
}

const isolatedPoolComptroller: GenericContractInfo = {
  abi: isolatedPoolComptrollerAbi,
};

const jumpRateModel: GenericContractInfo = {
  abi: jumpRateModelAbi,
};

const jumpRateModelV2: GenericContractInfo = {
  abi: jumpRateModelV2Abi,
};

const rewardsDistributor: GenericContractInfo = {
  abi: rewardsDistributorAbi,
};

const vToken: GenericContractInfo = {
  abi: vTokenAbi,
};

const bep20: GenericContractInfo = {
  abi: bep20Abi,
};

const pancakePairV2: GenericContractInfo = {
  abi: pancakePairV2Abi,
};

const genericContractInfos = {
  isolatedPoolComptroller,
  jumpRateModel,
  jumpRateModelV2,
  rewardsDistributor,
  vToken,
  bep20,
  pancakePairV2,
};

export type GenericContractName = keyof typeof genericContractInfos;

export type GenericContractTypes = {
  isolatedPoolComptroller: IsolatedPoolComptroller;
  jumpRateModel: JumpRateModel;
  jumpRateModelV2: JumpRateModelV2;
  rewardsDistributor: RewardsDistributor;
  vToken: VToken;
  bep20: Bep20;
  pancakePairV2: PancakePairV2;
};

export type GenericContractTypeByName<TContractName extends GenericContractName> =
  GenericContractTypes[TContractName];

export default genericContractInfos;

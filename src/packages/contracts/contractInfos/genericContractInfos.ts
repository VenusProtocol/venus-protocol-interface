import type { JsonFragment } from '@ethersproject/abi';
import { abi as isolatedPoolComptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as jumpRateModelV2Abi } from '@venusprotocol/isolated-pools/artifacts/contracts/JumpRateModelV2.sol/JumpRateModelV2.json';
import { abi as rewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { abi as vTokenAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/VToken.sol/VToken.json';
import { abi as jumpRateModelAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/InterestRateModels/JumpRateModel.sol/JumpRateModel.json';
<<<<<<< HEAD
import { abi as bep20Abi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/BEP20Interface.sol/BEP20Interface.json';
import { abi as vaiAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VAI/VAI.sol/VAI.json';
import { abi as vrtAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/VRT/VRT.sol/VRT.json';
import { abi as xvsAbi } from '@venusprotocol/venus-protocol/artifacts/contracts/Tokens/XVS/XVS.sol/XVS.json';
=======
>>>>>>> d56f71952 (refactor: remove unused ABIs + add contracts)

import {
  Comptroller as IsolatedPoolComptroller,
  JumpRateModelV2,
  RewardsDistributor,
  VToken,
} from '../types/contracts/isolatedPools';
<<<<<<< HEAD
import { PancakePairV2, VBnb } from '../types/contracts/others';
import { BEP20, JumpRateModel, VAI, VRT, XVS } from '../types/contracts/venusProtocol';
=======
import { Bep20, PancakePairV2 } from '../types/contracts/others';
import { JumpRateModel } from '../types/contracts/venusProtocol';
>>>>>>> d56f71952 (refactor: remove unused ABIs + add contracts)

import pancakePairV2Abi from './externalAbis/pancakePairV2.json';
import vBnbAbi from './externalAbis/vBnb.json';

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

const vBnb: GenericContractInfo = {
  abi: vBnbAbi,
};

const bep20: GenericContractInfo = {
  abi: bep20Abi,
};

const xvs: GenericContractInfo = {
  abi: xvsAbi,
};

const vai: GenericContractInfo = {
  abi: vaiAbi,
};

const vrt: GenericContractInfo = {
  abi: vrtAbi,
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
  vBnb,
  xvs,
  vai,
  vrt,
  pancakePairV2,
};

export type GenericContractName = keyof typeof genericContractInfos;

export type GenericContractTypes = {
  isolatedPoolComptroller: IsolatedPoolComptroller;
  jumpRateModel: JumpRateModel;
  jumpRateModelV2: JumpRateModelV2;
  rewardsDistributor: RewardsDistributor;
  vToken: VToken;
  bep20: BEP20;
  vBnb: VBnb;
  xvs: XVS;
  vai: VAI;
  vrt: VRT;
  pancakePairV2: PancakePairV2;
};

export type GenericContractTypeByName<TContractName extends GenericContractName> =
  GenericContractTypes[TContractName];

export default genericContractInfos;

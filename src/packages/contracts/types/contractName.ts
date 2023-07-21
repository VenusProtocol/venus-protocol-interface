import * as contractInfos from '../contractInfos';
import { Comptroller as IsolatedPoolComptroller, PoolLens } from './contracts/isolatedPools';
import { Maximillion, Multicall } from './contracts/others';
import {
  GovernorBravoDelegator,
  Comptroller as MainPoolComptroller,
  Unitroller,
  VAIVault,
  VRTConverter,
  VenusLens,
  XVSVault,
} from './contracts/venusProtocol';

export type ContractName = keyof typeof contractInfos;

export type ContractTypeByName<TContractName extends ContractName> =
  TContractName extends 'mainPoolComptroller'
    ? MainPoolComptroller
    : TContractName extends 'venusLens'
    ? VenusLens
    : TContractName extends 'poolLens'
    ? PoolLens
    : TContractName extends 'isolatedPoolComptroller'
    ? IsolatedPoolComptroller
    : TContractName extends 'vaiUnitrollerController'
    ? Unitroller
    : TContractName extends 'vaiVault'
    ? VAIVault
    : TContractName extends 'xvsVault'
    ? XVSVault
    : TContractName extends 'governorBravoDelegator'
    ? GovernorBravoDelegator
    : TContractName extends 'vrtConverter'
    ? VRTConverter
    : TContractName extends 'maximillion'
    ? Maximillion
    : TContractName extends 'multicall'
    ? Multicall
    : undefined;

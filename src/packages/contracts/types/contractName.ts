import * as contractInfos from '../contractInfos';
import { Comptroller as IsolatedPoolComptroller } from './contracts/isolatedPools';
import { Comptroller as MainPoolComptroller } from './contracts/venusProtocol';

export type ContractName = keyof typeof contractInfos;

export type ContractTypeByName<TContractName extends ContractName> =
  TContractName extends 'mainPoolComptroller'
    ? MainPoolComptroller
    : TContractName extends 'isolatedPoolComptroller'
    ? IsolatedPoolComptroller
    : undefined;

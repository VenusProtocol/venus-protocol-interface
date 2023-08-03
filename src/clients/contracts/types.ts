import { ContractTypeByName } from 'packages/contracts';

export type TokenContract<T extends string = ''> = T extends 'xvs'
  ? ContractTypeByName<'xvs'>
  : T extends 'vai'
  ? ContractTypeByName<'vai'>
  : T extends 'vrt'
  ? ContractTypeByName<'vrt'>
  : ContractTypeByName<'bep20'>;

export type VTokenContract<T extends string | undefined = undefined> = T extends 'bnb'
  ? ContractTypeByName<'vBnb'>
  : ContractTypeByName<'vToken'>;

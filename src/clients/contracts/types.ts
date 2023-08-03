import { ContractTypeByName } from 'packages/contracts';

import { VBnbToken, VaiToken, VrtToken, XvsToken } from 'types/contracts';

export type TokenContract<T extends string = ''> = T extends 'xvs'
  ? XvsToken
  : T extends 'vai'
  ? VaiToken
  : T extends 'vrt'
  ? VrtToken
  : ContractTypeByName<'bep20'>;

export type VTokenContract<T extends string | undefined = undefined> = T extends 'bnb'
  ? VBnbToken
  : ContractTypeByName<'vToken'>;

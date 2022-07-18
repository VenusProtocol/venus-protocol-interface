import { TokenId, VTokenId } from 'types';

import { Bep20, VBep20, VBnbToken, VaiToken, VrtToken, XvsToken } from 'types/contracts';

export type TokenContract<T extends TokenId> = T extends 'xvs'
  ? XvsToken
  : T extends 'vai'
  ? VaiToken
  : T extends 'vrt'
  ? VrtToken
  : Bep20;

export type VTokenContract<T extends VTokenId> = T extends 'bnb' ? VBnbToken : VBep20;

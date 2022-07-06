import BigNumber from 'bignumber.js';

import { VaiUnitroller } from 'types/contracts';

export interface GetMintableVaiInput {
  vaiControllerContract: VaiUnitroller;
  accountAddress: string;
}

export type GetMintableVaiOutput = {
  mintableVaiWei: BigNumber;
};

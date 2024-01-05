import BigNumber from 'bignumber.js';

import { Vai, VaiController } from 'packages/contracts';

export interface GetMintableVaiInput {
  accountAddress: string;
  vaiControllerContract: VaiController;
  vaiContract: Vai;
}

export interface GetMintableVaiOutput {
  mintableVaiMantissa: BigNumber;
}

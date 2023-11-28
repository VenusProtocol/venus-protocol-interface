import BigNumber from 'bignumber.js';

import { VaiController } from 'packages/contracts';

export interface GetMintableVaiInput {
  accountAddress: string;
  vaiControllerContract: VaiController;
}

export interface GetMintableVaiOutput {
  mintableVaiMantissa: BigNumber;
}

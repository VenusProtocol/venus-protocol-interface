import BigNumber from 'bignumber.js';

import { VaiController } from 'types/contracts';

export interface GetMintableVaiInput {
  vaiControllerContract: VaiController;
  accountAddress: string;
}

export interface GetMintableVaiOutput {
  mintableVaiWei: BigNumber;
}

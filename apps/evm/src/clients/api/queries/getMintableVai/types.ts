import type BigNumber from 'bignumber.js';

import type { Vai, VaiController } from 'libs/contracts';

export interface GetMintableVaiInput {
  accountAddress: string;
  vaiControllerContract: VaiController;
  vaiContract: Vai;
}

export interface GetMintableVaiOutput {
  vaiLiquidityMantissa: BigNumber;
  accountMintableVaiMantissa: BigNumber;
}

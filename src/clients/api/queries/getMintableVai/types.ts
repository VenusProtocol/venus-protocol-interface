import BigNumber from 'bignumber.js';
import { VaiController } from 'packages/contractsNew';

export interface GetMintableVaiInput {
  accountAddress: string;
  vaiControllerContract: VaiController;
}

export interface GetMintableVaiOutput {
  mintableVaiWei: BigNumber;
}

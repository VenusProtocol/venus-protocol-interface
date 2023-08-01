import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetMintableVaiInput {
  accountAddress: string;
  vaiControllerContract: ContractTypeByName<'vaiController'>;
}

export interface GetMintableVaiOutput {
  mintableVaiWei: BigNumber;
}

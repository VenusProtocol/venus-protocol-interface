import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetVaiVaultUserInfoInput {
  vaiVaultContract: ContractTypeByName<'vaiVault'>;
  accountAddress: string;
}

export interface GetVaiVaultUserInfoOutput {
  stakedVaiWei: BigNumber;
}

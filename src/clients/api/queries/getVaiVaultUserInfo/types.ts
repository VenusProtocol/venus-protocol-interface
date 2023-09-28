import BigNumber from 'bignumber.js';
import { VaiVault } from 'packages/contractsNew';

export interface GetVaiVaultUserInfoInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export interface GetVaiVaultUserInfoOutput {
  stakedVaiWei: BigNumber;
}

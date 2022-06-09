import BigNumber from 'bignumber.js';
import { VaiVault } from 'types/contracts';

export interface IGetVaiVaultUserInfoInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export interface IGetVaiVaultUserInfoOutput {
  stakedVaiWei: BigNumber;
}

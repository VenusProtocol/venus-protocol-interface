import BigNumber from 'bignumber.js';
import { VrtVault } from 'types/contracts';

export interface IGetVrtVaultUserInfoInput {
  vrtVaultContract: VrtVault;
  accountAddress: string;
}

export interface IGetVrtVaultUserInfoOutput {
  stakedVrtWei: BigNumber;
}

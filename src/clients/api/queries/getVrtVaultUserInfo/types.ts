import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';

export interface GetVrtVaultUserInfoInput {
  vrtVaultContract: VrtVault;
  accountAddress: string;
}

export interface GetVrtVaultUserInfoOutput {
  stakedVrtWei: BigNumber;
}

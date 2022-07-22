import BigNumber from 'bignumber.js';

import { VaiVault } from 'types/contracts';

export interface GetVaiVaultUserInfoInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export interface GetVaiVaultUserInfoOutput {
  stakedVaiWei: BigNumber;
}

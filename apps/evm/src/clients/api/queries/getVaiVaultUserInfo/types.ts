import type BigNumber from 'bignumber.js';

import type { VaiVault } from 'libs/contracts';

export interface GetVaiVaultUserInfoInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export interface GetVaiVaultUserInfoOutput {
  stakedVaiMantissa: BigNumber;
}

import type BigNumber from 'bignumber.js';

import type { VaiVault } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface StakeInVaiVaultInput {
  vaiVaultContract: VaiVault;
  amountMantissa: BigNumber;
}

export type StakeInVaiVaultOutput = LooseEthersContractTxData;

const stakeInVaiVault = ({
  vaiVaultContract,
  amountMantissa,
}: StakeInVaiVaultInput): StakeInVaiVaultOutput => ({
  contract: vaiVaultContract,
  methodName: 'deposit',
  args: [amountMantissa.toFixed()],
});

export default stakeInVaiVault;

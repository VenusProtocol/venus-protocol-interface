import type BigNumber from 'bignumber.js';

import type { VaiVault } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface WithdrawFromVaiVaultInput {
  vaiVaultContract: VaiVault;
  amountMantissa: BigNumber;
}

export type WithdrawFromVaiVaultOutput = LooseEthersContractTxData;

const withdrawFromVaiVault = ({
  vaiVaultContract,
  amountMantissa,
}: WithdrawFromVaiVaultInput): WithdrawFromVaiVaultOutput => ({
  contract: vaiVaultContract,
  methodName: 'withdraw',
  args: [amountMantissa.toFixed()],
});

export default withdrawFromVaiVault;

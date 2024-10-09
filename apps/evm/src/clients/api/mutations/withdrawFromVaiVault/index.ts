import type BigNumber from 'bignumber.js';

import type { VaiVault } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface WithdrawFromVaiVaultInput {
  vaiVaultContract: VaiVault;
  amountMantissa: BigNumber;
}

export type WithdrawFromVaiVaultOutput = ContractTxData<VaiVault, 'withdraw'>;

const withdrawFromVaiVault = async ({
  vaiVaultContract,
  amountMantissa,
}: WithdrawFromVaiVaultInput): Promise<WithdrawFromVaiVaultOutput> => ({
  contract: vaiVaultContract,
  methodName: 'withdraw',
  args: [amountMantissa.toFixed()],
});

export default withdrawFromVaiVault;

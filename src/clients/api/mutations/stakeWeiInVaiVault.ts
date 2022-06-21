import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { checkForVaiVaultTransactionError } from 'errors';
import { VaiVault } from 'types/contracts';

export interface IStakeWeiInVaiVaultInput {
  vaiVaultContract: VaiVault;
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type StakeWeiInVaiVaultOutput = TransactionReceipt;

const stakeWeiInVaiVault = async ({
  vaiVaultContract,
  fromAccountAddress,
  amountWei,
}: IStakeWeiInVaiVaultInput): Promise<StakeWeiInVaiVaultOutput> => {
  const resp = await vaiVaultContract.methods
    .deposit(amountWei.toFixed())
    .send({ from: fromAccountAddress });
  return checkForVaiVaultTransactionError(resp);
};

export default stakeWeiInVaiVault;

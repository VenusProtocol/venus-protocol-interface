import BigNumber from 'bignumber.js';

import { VaiVault } from 'types/contracts';

export interface GetVaiVaultPendingXvsWeiInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export type GetVaiVaultPendingXvsWeiOutput = BigNumber;

const getVaiVaultPendingXvsWei = async ({
  vaiVaultContract,
  accountAddress,
}: GetVaiVaultPendingXvsWeiInput): Promise<GetVaiVaultPendingXvsWeiOutput> => {
  const res = await vaiVaultContract.methods.pendingXVS(accountAddress).call();

  return new BigNumber(res);
};

export default getVaiVaultPendingXvsWei;

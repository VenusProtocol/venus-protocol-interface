import BigNumber from 'bignumber.js';

import { VaiVault } from 'types/contracts';

export interface GetVaiVaultPendingXvsInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export type GetVaiVaultPendingXvsOutput = {
  pendingXvsWei: BigNumber;
};

const getVaiVaultPendingXvs = async ({
  vaiVaultContract,
  accountAddress,
}: GetVaiVaultPendingXvsInput): Promise<GetVaiVaultPendingXvsOutput> => {
  const res = await vaiVaultContract.pendingXVS(accountAddress);

  return {
    pendingXvsWei: new BigNumber(res.toString()),
  };
};

export default getVaiVaultPendingXvs;

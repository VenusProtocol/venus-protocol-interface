import BigNumber from 'bignumber.js';
import { VaiVault } from 'types/contracts';

export interface IGetVaiVaultPendingXvsWeiInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export type GetVaiVaultPendingXvsWeiOutput = BigNumber;

const getVaiVaultPendingXvsWei = async ({
  vaiVaultContract,
  accountAddress,
}: IGetVaiVaultPendingXvsWeiInput): Promise<GetVaiVaultPendingXvsWeiOutput> => {
  const res = await vaiVaultContract.methods.pendingXVS(accountAddress).call();

  return new BigNumber(res);
};

export default getVaiVaultPendingXvsWei;

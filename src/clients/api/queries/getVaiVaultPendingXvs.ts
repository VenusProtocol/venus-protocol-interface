import BigNumber from 'bignumber.js';
import { VaiVault } from 'types/contracts';

export interface IGetVaiVaultPendingXvsInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export type GetVaiVaultPendingXvsOutput = BigNumber;

const getVaiVaultPendingXvs = async ({
  vaiVaultContract,
  accountAddress,
}: IGetVaiVaultPendingXvsInput): Promise<GetVaiVaultPendingXvsOutput> => {
  const res = await vaiVaultContract.methods.pendingXVS(accountAddress).call();

  return new BigNumber(res);
};

export default getVaiVaultPendingXvs;

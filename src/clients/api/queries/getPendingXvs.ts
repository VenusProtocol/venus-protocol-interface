import BigNumber from 'bignumber.js';
import { VaiVault } from 'types/contracts';

export interface IGetPendingXvsInput {
  vaiVaultContract: VaiVault;
  accountAddress: string;
}

export type GetPendingXvsOutput = BigNumber;

const getPendingXvs = async ({
  vaiVaultContract,
  accountAddress,
}: IGetPendingXvsInput): Promise<GetPendingXvsOutput> => {
  const resp = await vaiVaultContract.methods.pendingXVS(accountAddress).call();
  return new BigNumber(resp);
};

export default getPendingXvs;

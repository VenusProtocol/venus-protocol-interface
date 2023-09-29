import BigNumber from 'bignumber.js';
import { Bep20, Vai, Vrt, Xvs } from 'packages/contracts';

export interface GetAllowanceInput {
  tokenContract: Vai | Bep20 | Vrt | Xvs;
  accountAddress: string;
  spenderAddress: string;
}

export type GetAllowanceOutput = {
  allowanceWei: BigNumber;
};

const getAllowance = async ({
  tokenContract,
  accountAddress,
  spenderAddress,
}: GetAllowanceInput): Promise<GetAllowanceOutput> => {
  const res = await tokenContract.allowance(accountAddress, spenderAddress);

  return {
    allowanceWei: new BigNumber(res.toString()),
  };
};

export default getAllowance;

import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetAllowanceInput {
  tokenContract: ContractTypeByName<'vai' | 'bep20' | 'vrt' | 'xvs'>;
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

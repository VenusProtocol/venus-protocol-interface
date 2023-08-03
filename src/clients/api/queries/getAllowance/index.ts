import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import { VaiToken, VrtToken, XvsToken } from 'types/contracts';

export interface GetAllowanceInput {
  tokenContract: VrtToken | XvsToken | ContractTypeByName<'bep20'> | VaiToken;
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

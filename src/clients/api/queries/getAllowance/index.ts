import BigNumber from 'bignumber.js';

import { Bep20, VaiToken, VrtToken, XvsToken } from 'types/contracts';

export interface GetAllowanceInput {
  tokenContract: VrtToken | XvsToken | Bep20 | VaiToken;
  accountAddress: string;
  spenderAddress: string;
}

export type GetAllowanceOutput = BigNumber;

const getVenusVaiState = async ({
  tokenContract,
  accountAddress,
  spenderAddress,
}: GetAllowanceInput): Promise<GetAllowanceOutput> => {
  const res = await tokenContract.methods.allowance(accountAddress, spenderAddress).call();
  return new BigNumber(res);
};

export default getVenusVaiState;

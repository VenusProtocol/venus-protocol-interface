import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import { VBnbToken } from 'types/contracts';

export interface GetVTokenBalanceOfInput {
  vTokenContract: ContractTypeByName<'vToken'> | VBnbToken;
  accountAddress: string;
}

export type GetVTokenBalanceOfOutput = {
  balanceWei: BigNumber;
};

const getVTokenBalanceOf = async ({
  vTokenContract,
  accountAddress,
}: GetVTokenBalanceOfInput): Promise<GetVTokenBalanceOfOutput> => {
  const res = await vTokenContract.balanceOf(accountAddress);

  return {
    balanceWei: new BigNumber(res.toString()),
  };
};

export default getVTokenBalanceOf;

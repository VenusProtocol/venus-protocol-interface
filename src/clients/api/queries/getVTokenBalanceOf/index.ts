import BigNumber from 'bignumber.js';

import { VBep20, VBnbToken } from 'types/contracts';

export interface GetVTokenBalanceOfInput {
  vTokenContract: VBep20 | VBnbToken;
  accountAddress: string;
}

export type GetVTokenBalanceOfOutput = {
  balanceWei: BigNumber;
};

const getVTokenBalanceOf = async ({
  vTokenContract,
  accountAddress,
}: GetVTokenBalanceOfInput): Promise<GetVTokenBalanceOfOutput> => {
  const res = await vTokenContract.methods.balanceOf(accountAddress).call();

  return {
    balanceWei: new BigNumber(res),
  };
};

export default getVTokenBalanceOf;

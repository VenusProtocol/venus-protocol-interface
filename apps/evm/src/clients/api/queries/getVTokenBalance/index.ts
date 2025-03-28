import BigNumber from 'bignumber.js';

import type { VBep20, VBnb } from 'libs/contracts';

export interface GetVTokenBalanceInput {
  vTokenContract: VBep20 | VBnb;
  accountAddress: string;
}

export type GetVTokenBalanceOutput = {
  balanceMantissa: BigNumber;
};

export const getVTokenBalance = async ({
  vTokenContract,
  accountAddress,
}: GetVTokenBalanceInput): Promise<GetVTokenBalanceOutput> => {
  const res = await vTokenContract.balanceOf(accountAddress);

  return {
    balanceMantissa: new BigNumber(res.toString()),
  };
};

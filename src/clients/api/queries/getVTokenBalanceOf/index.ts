import BigNumber from 'bignumber.js';
import { VBep20, VBnb } from 'packages/contracts';

export interface GetVTokenBalanceOfInput {
  vTokenContract: VBep20 | VBnb;
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

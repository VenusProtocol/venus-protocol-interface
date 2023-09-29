import BigNumber from 'bignumber.js';
import { VBnb, VToken as VTokenContract } from 'packages/contractsNew';

export interface GetVTokenBalanceOfInput {
  vTokenContract: VTokenContract | VBnb;
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

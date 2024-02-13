import BigNumber from 'bignumber.js';
import { VBep20, VBnb } from 'libs/contracts';

export interface GetVTokenBalanceOfInput {
  vTokenContract: VBep20 | VBnb;
  accountAddress: string;
}

export type GetVTokenBalanceOfOutput = {
  balanceMantissa: BigNumber;
};

const getVTokenBalanceOf = async ({
  vTokenContract,
  accountAddress,
}: GetVTokenBalanceOfInput): Promise<GetVTokenBalanceOfOutput> => {
  const res = await vTokenContract.balanceOf(accountAddress);

  return {
    balanceMantissa: new BigNumber(res.toString()),
  };
};

export default getVTokenBalanceOf;

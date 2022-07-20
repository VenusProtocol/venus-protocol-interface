import { VBep20, VBnbToken } from 'types/contracts';

export interface GetVTokenBalanceOfInput {
  vTokenContract: VBep20 | VBnbToken;
  accountAddress: string;
}

export type GetVTokenBalanceOfOutput = string;

const getVTokenBalanceOf = async ({
  vTokenContract,
  accountAddress,
}: GetVTokenBalanceOfInput): Promise<GetVTokenBalanceOfOutput> =>
  vTokenContract.methods.balanceOf(accountAddress).call();

export default getVTokenBalanceOf;

import BigNumber from 'bignumber.js';
import { VBep20, VBnbToken } from 'types/contracts';

export interface IGetVTokenBorrowBalanceInput {
  vTokenContract: VBep20 | VBnbToken;
  accountAddress: string;
}

export type GetVTokenBorrowBalanceOutput = BigNumber;

const getVTokenBorrowBalance = async ({
  vTokenContract,
  accountAddress,
}: IGetVTokenBorrowBalanceInput): Promise<GetVTokenBorrowBalanceOutput> => {
  const res = await vTokenContract.methods.borrowBalanceCurrent(accountAddress).call();
  return new BigNumber(res);
};

export default getVTokenBorrowBalance;

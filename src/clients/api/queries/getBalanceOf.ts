import BigNumber from 'bignumber.js';
import { VrtToken, XvsToken, Bep20, VaiToken } from 'types/contracts';

export interface IGetBalanceOfInput {
  tokenContract: VrtToken | XvsToken | Bep20 | VaiToken;
  accountAddress: string;
}

export type GetBalanceOfOutput = BigNumber;

const getBalanceOf = async ({
  tokenContract,
  accountAddress,
}: IGetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  const resp = await tokenContract.methods.balanceOf(accountAddress).call();
  return new BigNumber(resp);
};

export default getBalanceOf;

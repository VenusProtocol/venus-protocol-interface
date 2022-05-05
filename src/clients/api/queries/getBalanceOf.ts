import { VrtToken, XvsToken, Bep20, VaiToken } from 'types/contracts';

export interface IGetBalanceOfInput {
  tokenContract: VrtToken | XvsToken | Bep20 | VaiToken;
  accountAddress: string;
}

export type GetBalanceOfOutput = string;

const getBalanceOf = ({
  tokenContract,
  accountAddress,
}: IGetBalanceOfInput): Promise<GetBalanceOfOutput> =>
  tokenContract.methods.balanceOf(accountAddress).call();

export default getBalanceOf;

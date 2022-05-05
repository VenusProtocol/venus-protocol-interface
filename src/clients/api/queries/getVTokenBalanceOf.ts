export interface IGetVTokenBalanceOfInput {
  tokenContract: $TSFixMe; // @TODO: use contract type once defined (Typechain?)
  account: string;
}

export type GetVTokenBalanceOfOutput = string;

const getVTokenBalanceOf = async ({
  tokenContract,
  account,
}: IGetVTokenBalanceOfInput): Promise<GetVTokenBalanceOfOutput> =>
  tokenContract.methods.balanceOf(account).call();
export default getVTokenBalanceOf;

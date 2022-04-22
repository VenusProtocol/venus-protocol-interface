export interface IGetVTokenBalanceInput {
  tokenContract: $TSFixMe; // @TODO: use contract type once defined (Typechain?)
  account: string;
}

export type GetVTokenBalanceOutput = string;

const getVTokenBalance = async ({
  tokenContract,
  account,
}: IGetVTokenBalanceInput): Promise<GetVTokenBalanceOutput> =>
  tokenContract.methods.balanceOf(account).call();
export default getVTokenBalance;

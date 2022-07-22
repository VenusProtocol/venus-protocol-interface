export interface GetVTokenBalancesAllInput {
  venusLensContract: $TSFixMe; // @TODO: use contract type (through Typechain?)
  account: string;
  vTokenAddresses: string[];
}

interface GetVTokenBalancesAllResponse extends Array<string> {
  balanceOf: string;
  balanceOfUnderlying: string;
  borrowBalanceCurrent: string;
  tokenAllowance: string;
  tokenBalance: string;
  vToken: string;
}

interface GetVTokenBalanceOutput {
  balanceOf: string;
  balanceOfUnderlying: string;
  borrowBalanceCurrent: string;
  tokenAllowance: string;
  tokenBalance: string;
  vToken: string;
}

export type IGetVTokenBalancesAllOutput = GetVTokenBalanceOutput[];

const getVTokenBalancesAll = async ({
  venusLensContract,
  vTokenAddresses,
  account,
}: GetVTokenBalancesAllInput): Promise<IGetVTokenBalancesAllOutput> => {
  let response = await venusLensContract.methods
    .vTokenBalancesAll(vTokenAddresses, account?.toLowerCase())
    .call();

  // This is original returned as an array with these properties
  // but at some point the properties are getting lost
  response = response.map((item: GetVTokenBalancesAllResponse) => ({
    balanceOf: item.balanceOf,
    balanceOfUnderlying: item.balanceOfUnderlying,
    borrowBalanceCurrent: item.borrowBalanceCurrent,
    tokenAllowance: item.tokenAllowance,
    tokenBalance: item.tokenBalance,
    vToken: item.vToken,
  }));

  return response;
};

export default getVTokenBalancesAll;

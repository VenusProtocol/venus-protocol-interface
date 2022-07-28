import BigNumber from 'bignumber.js';

import { Bep20, VaiToken, VrtToken, XvsToken } from 'types/contracts';

export interface GetBalanceOfInput {
  tokenContract: VrtToken | XvsToken | Bep20 | VaiToken;
  accountAddress: string;
}

export type GetBalanceOfOutput = {
  balanceWei: BigNumber;
};

const getBalanceOf = async ({
  tokenContract,
  accountAddress,
}: GetBalanceOfInput): Promise<GetBalanceOfOutput> => {
  const resp = await tokenContract.methods.balanceOf(accountAddress).call();

  return {
    balanceWei: new BigNumber(resp),
  };
};

export default getBalanceOf;

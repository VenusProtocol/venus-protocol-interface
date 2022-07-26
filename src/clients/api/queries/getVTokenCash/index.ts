import BigNumber from 'bignumber.js';

import { VBep20, VBnbToken } from 'types/contracts';

export interface GetVTokenCashInput {
  vTokenContract: VBep20 | VBnbToken;
}

export type GetVTokenCashOutput = {
  cashWei: BigNumber;
};

const getVTokenCash = async ({
  vTokenContract,
}: GetVTokenCashInput): Promise<GetVTokenCashOutput> => {
  const res = await vTokenContract.methods.getCash().call();

  return {
    cashWei: new BigNumber(res),
  };
};

export default getVTokenCash;

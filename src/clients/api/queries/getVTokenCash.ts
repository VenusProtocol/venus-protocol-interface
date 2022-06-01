import BigNumber from 'bignumber.js';
import { VBep20, VBnbToken } from 'types/contracts';

export interface IGetVTokenCashInput {
  vTokenContract: VBep20 | VBnbToken;
}

export type GetVTokenCashOutput = BigNumber;

const getVTokenCash = async ({
  vTokenContract,
}: IGetVTokenCashInput): Promise<GetVTokenCashOutput> => {
  const res = await vTokenContract.methods.getCash().call();
  return new BigNumber(res);
};

export default getVTokenCash;

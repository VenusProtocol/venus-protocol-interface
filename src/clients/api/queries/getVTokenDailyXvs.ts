import BigNumber from 'bignumber.js';
import { VenusLens } from 'types/contracts';
import { getContractAddress } from 'utilities';

export interface IGetVTokenDailyXvsInput {
  venusLensContract: VenusLens;
  account: string;
}

export type IGetVTokenDailyXvsOutput = BigNumber;

const getVTokenDailyXvs = async ({
  venusLensContract,
  account,
}: IGetVTokenDailyXvsInput): Promise<IGetVTokenDailyXvsOutput> => {
  const response = await venusLensContract.methods
    .getDailyXVS(account.toLowerCase(), getContractAddress('comptroller'))
    .call();
  return new BigNumber(response);
};

export default getVTokenDailyXvs;

import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';

import { VenusLens } from 'types/contracts';

export interface GetDailyXvsWeiInput {
  venusLensContract: VenusLens;
  accountAddress: string;
}

export type IGetDailyXvsOutput = {
  dailyXvsWei: BigNumber;
};

const comptrollerAddress = getContractAddress('comptroller');

const getDailyXvs = async ({
  venusLensContract,
  accountAddress,
}: GetDailyXvsWeiInput): Promise<IGetDailyXvsWeiOutput> => {
  const response = await venusLensContract.methods
    .getDailyXVS(accountAddress, comptrollerAddress)
    .call();

  return {
    dailyXvsWei: new BigNumber(response),
  };
};

export default getDailyXvs;

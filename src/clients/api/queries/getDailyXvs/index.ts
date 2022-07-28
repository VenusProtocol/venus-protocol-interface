import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';

import { VenusLens } from 'types/contracts';

export interface GetDailyXvsInput {
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
}: GetDailyXvsInput): Promise<IGetDailyXvsOutput> => {
  const response = await venusLensContract.methods
    .getDailyXVS(accountAddress, comptrollerAddress)
    .call();

  return {
    dailyXvsWei: new BigNumber(response),
  };
};

export default getDailyXvs;

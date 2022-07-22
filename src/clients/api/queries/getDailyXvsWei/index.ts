import BigNumber from 'bignumber.js';
import { getContractAddress } from 'utilities';

import { VenusLens } from 'types/contracts';

export interface GetDailyXvsWeiInput {
  venusLensContract: VenusLens;
  accountAddress: string;
}

export type IGetDailyXvsWeiOutput = BigNumber;

const comptrollerAddress = getContractAddress('comptroller');
const getDailyXvsWei = async ({
  venusLensContract,
  accountAddress,
}: GetDailyXvsWeiInput): Promise<IGetDailyXvsWeiOutput> => {
  const response = await venusLensContract.methods
    .getDailyXVS(accountAddress, comptrollerAddress)
    .call();
  return new BigNumber(response);
};

export default getDailyXvsWei;

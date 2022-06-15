import BigNumber from 'bignumber.js';
import { VenusLens } from 'types/contracts';
import { getContractAddress } from 'utilities';

export interface IGetDailyXvsWeiInput {
  venusLensContract: VenusLens;
  accountAddress: string;
}

export type IGetDailyXvsWeiOutput = BigNumber;

const comptrollerAddress = getContractAddress('comptroller');
const getDailyXvsWei = async ({
  venusLensContract,
  accountAddress,
}: IGetDailyXvsWeiInput): Promise<IGetDailyXvsWeiOutput> => {
  const response = await venusLensContract.methods
    .getDailyXVS(accountAddress, comptrollerAddress)
    .call();
  return new BigNumber(response);
};

export default getDailyXvsWei;

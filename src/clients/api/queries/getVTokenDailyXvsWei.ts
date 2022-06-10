import BigNumber from 'bignumber.js';
import { VenusLens } from 'types/contracts';
import { getContractAddress } from 'utilities';

export interface IGetVTokenDailyXvsWeiInput {
  venusLensContract: VenusLens;
  accountAddress: string;
}

export type IGetVTokenDailyXvsWeiOutput = BigNumber;

const comptrollerAddress = getContractAddress('comptroller');
const getVTokenDailyXvsWei = async ({
  venusLensContract,
  accountAddress,
}: IGetVTokenDailyXvsWeiInput): Promise<IGetVTokenDailyXvsWeiOutput> => {
  const response = await venusLensContract.methods
    .getDailyXVS(accountAddress, comptrollerAddress)
    .call();
  return new BigNumber(response);
};

export default getVTokenDailyXvsWei;

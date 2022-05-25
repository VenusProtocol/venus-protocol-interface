import BigNumber from 'bignumber.js';
import { Comptroller } from 'types/contracts';

export interface IGetVenusAccruedInput {
  comptrollerContract: Comptroller;
  accountAddress: string;
}

export type GetVenusAccruedOutput = BigNumber;

const getVenusAccrued = async ({
  comptrollerContract,
  accountAddress,
}: IGetVenusAccruedInput): Promise<GetVenusAccruedOutput> => {
  const res = await comptrollerContract.methods.venusAccrued(accountAddress).call();
  return new BigNumber(res);
};

export default getVenusAccrued;

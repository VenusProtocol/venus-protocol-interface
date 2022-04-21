import BigNumber from 'bignumber.js';

import { Comptroller } from 'types/contracts';

export interface IGetVenusInitialIndexInput {
  comptrollerContract: Comptroller;
}

export type GetVenusInitialIndexOutput = BigNumber;

const getVenusInitialIndex = async ({
  comptrollerContract,
}: IGetVenusInitialIndexInput): Promise<GetVenusInitialIndexOutput> => {
  const res = await comptrollerContract.methods.venusInitialIndex().call();
  return new BigNumber(res);
};

export default getVenusInitialIndex;

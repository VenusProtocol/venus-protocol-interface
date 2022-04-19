import { Comptroller } from 'types/contracts';

export interface IGetVenusInitialIndexInput {
  comptrollerContract: Comptroller;
}

export type GetVenusInitialIndexOutput = number;

const getVenusInitialIndex = async ({
  comptrollerContract,
}: IGetVenusInitialIndexInput): Promise<GetVenusInitialIndexOutput> => {
  const res = await comptrollerContract.methods.venusInitialIndex().call();
  return +res;
};

export default getVenusInitialIndex;

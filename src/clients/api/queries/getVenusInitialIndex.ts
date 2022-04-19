import { Comptroller } from 'types/contracts';

export interface IGetVenusInitialIndexInput {
  comptrollerContract: Comptroller;
}

export type GetVenusInitialIndexOutput = string;

const getVenusInitialIndex = ({
  comptrollerContract,
}: IGetVenusInitialIndexInput): Promise<GetVenusInitialIndexOutput> =>
  comptrollerContract.methods.venusInitialIndex().call();

export default getVenusInitialIndex;

import { VaiUnitroller } from 'types/contracts';

export interface IGetVenusVaiMinterIndexInput {
  vaiUnitrollerContract: VaiUnitroller;
  accountAddress: string;
}

export type GetVenusVaiMinterIndexOutput = string;

const getVenusVaiMinterIndex = async ({
  vaiUnitrollerContract,
  accountAddress,
}: IGetVenusVaiMinterIndexInput): Promise<GetVenusVaiMinterIndexOutput> =>
  vaiUnitrollerContract.methods.venusVAIMinterIndex(accountAddress).call();

export default getVenusVaiMinterIndex;

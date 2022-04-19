import { VaiUnitroller } from 'types/contracts';

export interface IGetVenusVaiMinterIndexInput {
  vaiUnitrollerContract: VaiUnitroller;
  accountAddress: string;
}

export type GetVenusVaiMinterIndexOutput = number;

const getVenusVaiMinterIndex = async ({
  vaiUnitrollerContract,
  accountAddress,
}: IGetVenusVaiMinterIndexInput): Promise<GetVenusVaiMinterIndexOutput> => {
  const res = await vaiUnitrollerContract.methods.venusVAIMinterIndex(accountAddress).call();
  return +res;
};

export default getVenusVaiMinterIndex;

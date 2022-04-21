import BigNumber from 'bignumber.js';
import { VaiUnitroller } from 'types/contracts';

export interface IGetVenusVaiMinterIndexInput {
  vaiUnitrollerContract: VaiUnitroller;
  accountAddress: string;
}

export type GetVenusVaiMinterIndexOutput = BigNumber;

const getVenusVaiMinterIndex = async ({
  vaiUnitrollerContract,
  accountAddress,
}: IGetVenusVaiMinterIndexInput): Promise<GetVenusVaiMinterIndexOutput> => {
  const res = await vaiUnitrollerContract.methods.venusVAIMinterIndex(accountAddress).call();
  return new BigNumber(res);
};

export default getVenusVaiMinterIndex;

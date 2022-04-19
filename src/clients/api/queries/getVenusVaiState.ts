import { VaiUnitroller } from 'types/contracts';

export interface IGetVenusVaiStateInput {
  vaiUnitrollerContract: VaiUnitroller;
}

export interface IGetVenusVaiStateOutput {
  index: string;
  block: string;
}

const getVenusVaiState = ({
  vaiUnitrollerContract,
}: IGetVenusVaiStateInput): Promise<IGetVenusVaiStateOutput> =>
  vaiUnitrollerContract.methods.venusVAIState().call();

export default getVenusVaiState;

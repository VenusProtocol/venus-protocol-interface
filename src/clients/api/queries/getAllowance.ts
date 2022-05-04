import { VrtToken, XvsToken, Bep20, VaiToken } from 'types/contracts';

export interface IGetAllowanceInput {
  tokenContract: VrtToken | XvsToken | Bep20 | VaiToken;
  accountAddress: string;
  spenderAddress: string;
}

export type GetAllowanceOutput = string;

const getVenusVaiState = ({
  tokenContract,
  accountAddress,
  spenderAddress,
}: IGetAllowanceInput): Promise<GetAllowanceOutput> =>
  tokenContract.methods.allowance(accountAddress, spenderAddress).call();

export default getVenusVaiState;

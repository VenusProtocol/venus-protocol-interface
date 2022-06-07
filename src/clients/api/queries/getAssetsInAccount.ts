import { Comptroller } from 'types/contracts';

export interface IGetAssetsInAccountInput {
  comptrollerContract: Comptroller;
  account: string;
}

export type GetAssetsInAccountOutput = string[];

const getAssetsInAccount = ({
  comptrollerContract,
  account,
}: IGetAssetsInAccountInput): Promise<GetAssetsInAccountOutput> =>
  comptrollerContract.methods.getAssetsIn(account?.toLowerCase()).call();

export default getAssetsInAccount;

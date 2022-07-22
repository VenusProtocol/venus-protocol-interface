import { Comptroller } from 'types/contracts';

export interface GetAssetsInAccountInput {
  comptrollerContract: Comptroller;
  account: string;
}

export type GetAssetsInAccountOutput = string[];

const getAssetsInAccount = ({
  comptrollerContract,
  account,
}: GetAssetsInAccountInput): Promise<GetAssetsInAccountOutput> =>
  comptrollerContract.methods.getAssetsIn(account?.toLowerCase()).call();

export default getAssetsInAccount;

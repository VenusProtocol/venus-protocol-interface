import { MainPoolComptroller } from 'packages/contractsNew';

export interface GetMainAssetsInAccountInput {
  mainPoolComptrollerContract: MainPoolComptroller;
  accountAddress: string;
}

export type GetMainAssetsInAccountOutput = {
  tokenAddresses: string[];
};

const getMainAssetsInAccount = async ({
  mainPoolComptrollerContract,
  accountAddress,
}: GetMainAssetsInAccountInput): Promise<GetMainAssetsInAccountOutput> => {
  const tokenAddresses = await mainPoolComptrollerContract.getAssetsIn(accountAddress);

  return {
    tokenAddresses,
  };
};

export default getMainAssetsInAccount;

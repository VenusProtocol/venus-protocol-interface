import { Comptroller } from 'types/contracts';

export interface GetAssetsInAccountInput {
  comptrollerContract: Comptroller;
  accountAddress: string;
}

export type GetAssetsInAccountOutput = {
  tokenAddresses: string[];
};

const getAssetsInAccount = async ({
  comptrollerContract,
  accountAddress,
}: GetAssetsInAccountInput): Promise<GetAssetsInAccountOutput> => {
  const tokenAddresses = await comptrollerContract.getAssetsIn(accountAddress);

  return {
    tokenAddresses,
  };
};

export default getAssetsInAccount;

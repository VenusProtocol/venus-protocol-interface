import { ContractTypeByName } from 'packages/contracts';

export interface GetMainAssetsInAccountInput {
  mainPoolComptrollerContract: ContractTypeByName<'mainPoolComptroller'>;
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

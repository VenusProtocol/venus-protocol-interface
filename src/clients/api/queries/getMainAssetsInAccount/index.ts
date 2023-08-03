import { ContractTypeByName } from 'packages/contracts';

export interface GetMainAssetsInAccountInput {
  comptrollerContract: ContractTypeByName<'mainPoolComptroller'>;
  accountAddress: string;
}

export type GetMainAssetsInAccountOutput = {
  tokenAddresses: string[];
};

const getMainAssetsInAccount = async ({
  comptrollerContract,
  accountAddress,
}: GetMainAssetsInAccountInput): Promise<GetMainAssetsInAccountOutput> => {
  const tokenAddresses = await comptrollerContract.getAssetsIn(accountAddress);

  return {
    tokenAddresses,
  };
};

export default getMainAssetsInAccount;

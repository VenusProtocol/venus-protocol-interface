import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

export interface GetMintedVaiInput {
  comptrollerContract: ContractTypeByName<'mainPoolComptroller'>;
  accountAddress: string;
}

export type GetMintedVaiOutput = {
  mintedVaiWei: BigNumber;
};

const getMintedVai = async ({
  comptrollerContract,
  accountAddress,
}: GetMintedVaiInput): Promise<GetMintedVaiOutput> => {
  const res = await comptrollerContract.mintedVAIs(accountAddress);

  return {
    mintedVaiWei: new BigNumber(res.toString()),
  };
};

export default getMintedVai;

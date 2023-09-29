import BigNumber from 'bignumber.js';
import { MainPoolComptroller } from 'packages/contracts';

export interface GetMintedVaiInput {
  mainPoolComptrollerContract: MainPoolComptroller;
  accountAddress: string;
}

export type GetMintedVaiOutput = {
  mintedVaiWei: BigNumber;
};

const getMintedVai = async ({
  mainPoolComptrollerContract,
  accountAddress,
}: GetMintedVaiInput): Promise<GetMintedVaiOutput> => {
  const res = await mainPoolComptrollerContract.mintedVAIs(accountAddress);

  return {
    mintedVaiWei: new BigNumber(res.toString()),
  };
};

export default getMintedVai;

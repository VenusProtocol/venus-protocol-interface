import BigNumber from 'bignumber.js';
import { LegacyPoolComptroller } from 'packages/contracts';

export interface GetMintedVaiInput {
  legacyPoolComptrollerContract: LegacyPoolComptroller;
  accountAddress: string;
}

export type GetMintedVaiOutput = {
  mintedVaiMantissa: BigNumber;
};

const getMintedVai = async ({
  legacyPoolComptrollerContract,
  accountAddress,
}: GetMintedVaiInput): Promise<GetMintedVaiOutput> => {
  const res = await legacyPoolComptrollerContract.mintedVAIs(accountAddress);

  return {
    mintedVaiMantissa: new BigNumber(res.toString()),
  };
};

export default getMintedVai;

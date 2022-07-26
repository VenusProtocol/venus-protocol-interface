import BigNumber from 'bignumber.js';

import { Comptroller } from 'types/contracts';

export interface GetMintedVaiInput {
  comptrollerContract: Comptroller;
  accountAddress: string;
}

export type GetMintedVaiOutput = {
  mintedVaiWei: BigNumber;
};

const getMintedVai = async ({
  comptrollerContract,
  accountAddress,
}: GetMintedVaiInput): Promise<GetMintedVaiOutput> => {
  const res = await comptrollerContract.methods.mintedVAIs(accountAddress).call();

  return {
    mintedVaiWei: new BigNumber(res),
  };
};

export default getMintedVai;

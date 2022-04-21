import BigNumber from 'bignumber.js';
import { Comptroller } from 'types/contracts';

export interface IGetMintedVaiInput {
  comptrollerContract: Comptroller;
  accountAddress: string;
}

export type GetMintedVaiOutput = BigNumber;

const getMintedVai = async ({
  comptrollerContract,
  accountAddress,
}: IGetMintedVaiInput): Promise<GetMintedVaiOutput> => {
  const res = await comptrollerContract.methods.mintedVAIs(accountAddress).call();
  return new BigNumber(res);
};

export default getMintedVai;

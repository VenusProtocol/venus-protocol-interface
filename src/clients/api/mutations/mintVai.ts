import BigNumber from 'bignumber.js';

export interface IMintVaiInput {
  vaiControllerContract: $TSFixMe; // @TODO: use contract type once defined (Typechain?)
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type MintVaiOutput = void;

const mintVai = async ({
  vaiControllerContract,
  fromAccountAddress,
  amountWei,
}: IMintVaiInput): Promise<MintVaiOutput> =>
  vaiControllerContract.methods.mintVAI(amountWei).send({ from: fromAccountAddress });

export default mintVai;

import BigNumber from 'bignumber.js';

export interface IMintVaiInput {
  vaiControllerContract: $TSFixMe; // @TODO: use contract type once defined (Typechain?)
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type IMintVaiOutput = void;

const mintVai = async ({
  vaiControllerContract,
  fromAccountAddress,
  amountWei,
}: IMintVaiInput): Promise<IMintVaiOutput> =>
  vaiControllerContract.methods.mintVAI(amountWei).send({ from: fromAccountAddress });

export default mintVai;

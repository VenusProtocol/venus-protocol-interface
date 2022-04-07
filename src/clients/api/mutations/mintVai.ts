import BigNumber from 'bignumber.js';

export type MintVaiInput = {
  vaiControllerContract: $TSFixMe; // @TODO: use contract type once defined (Typechain?)
  fromAccountAddress: string;
  amountWei: BigNumber;
};

export type MintVaiOutput = void;

const mintVai = async ({
  vaiControllerContract,
  fromAccountAddress,
  amountWei,
}: MintVaiInput): Promise<MintVaiOutput> =>
  vaiControllerContract.methods.mintVAI(amountWei).send({ from: fromAccountAddress });

export default mintVai;

import BigNumber from 'bignumber.js';

export interface IRepayVaiInput {
  vaiControllerContract: $TSFixMe; // @TODO: use contract type once defined (Typechain?)
  fromAccountAddress: string;
  amountWei: BigNumber;
}

export type IRepayVaiOutput = void;

const repayVai = async ({
  vaiControllerContract,
  fromAccountAddress,
  amountWei,
}: IRepayVaiInput): Promise<IRepayVaiOutput> =>
  vaiControllerContract.methods.repayVAI(amountWei).send({ from: fromAccountAddress });

export default repayVai;

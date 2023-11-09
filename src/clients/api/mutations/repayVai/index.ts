import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';
import { VaiController } from 'packages/contracts';

export interface RepayVaiInput {
  amountWei: BigNumber;
  vaiControllerContract: VaiController;
}

export type IRepayVaiOutput = ContractTransaction;

const repayVai = async ({
  vaiControllerContract,
  amountWei,
}: RepayVaiInput): Promise<IRepayVaiOutput> => vaiControllerContract.repayVAI(amountWei.toFixed());

export default repayVai;

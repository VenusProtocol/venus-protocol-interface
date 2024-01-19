import BigNumber from 'bignumber.js';
import { ContractTransaction } from 'ethers';

import { VaiController } from 'packages/contracts';

export interface RepayVaiInput {
  amountMantissa: BigNumber;
  vaiControllerContract: VaiController;
}

export type IRepayVaiOutput = ContractTransaction;

const repayVai = async ({
  vaiControllerContract,
  amountMantissa,
}: RepayVaiInput): Promise<IRepayVaiOutput> =>
  vaiControllerContract.repayVAI(amountMantissa.toFixed());

export default repayVai;

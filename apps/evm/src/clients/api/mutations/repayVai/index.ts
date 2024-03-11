import type BigNumber from 'bignumber.js';
import type { ContractTransaction } from 'ethers';

import type { VaiController } from 'libs/contracts';

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

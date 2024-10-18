import type BigNumber from 'bignumber.js';

import type { VaiController } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface RepayVaiInput {
  amountMantissa: BigNumber;
  vaiControllerContract: VaiController;
}

export type IRepayVaiOutput = ContractTxData<VaiController, 'repayVAI'>;

const repayVai = ({ vaiControllerContract, amountMantissa }: RepayVaiInput): IRepayVaiOutput => ({
  contract: vaiControllerContract,
  methodName: 'repayVAI',
  args: [amountMantissa.toFixed()],
});

export default repayVai;

import type BigNumber from 'bignumber.js';

import type { VaiController } from 'libs/contracts';
import type { LooseEthersContractTxData } from 'types';

export interface RepayVaiInput {
  amountMantissa: BigNumber;
  vaiControllerContract: VaiController;
}

export type IRepayVaiOutput = LooseEthersContractTxData;

const repayVai = ({ vaiControllerContract, amountMantissa }: RepayVaiInput): IRepayVaiOutput => ({
  contract: vaiControllerContract,
  methodName: 'repayVAI',
  args: [amountMantissa.toFixed()],
});

export default repayVai;

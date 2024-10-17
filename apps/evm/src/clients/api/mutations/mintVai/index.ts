import type BigNumber from 'bignumber.js';

import type { VaiController } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface MintVaiInput {
  vaiControllerContract: VaiController;
  amountMantissa: BigNumber;
}

export type MintVaiOutput = ContractTxData<VaiController, 'mintVAI'>;

const mintVai = ({ vaiControllerContract, amountMantissa }: MintVaiInput): MintVaiOutput => ({
  contract: vaiControllerContract,
  methodName: 'mintVAI',
  args: [amountMantissa.toFixed()],
});

export default mintVai;

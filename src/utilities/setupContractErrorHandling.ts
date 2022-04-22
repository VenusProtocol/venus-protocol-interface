import type { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { ContractError } from './errors';

interface TransactionError {
  receipt: string;
  message: string;
}

interface ConnectionError {
  message: string;
  code: string;
  reason: string;
}

interface RevertInstructionError {
  message: string;
  signature: string;
  reason: string;
}

interface TransactionRevertInstructionError {
  message: string;
  signature: string;
  reason: string;
  receipt: string;
}

const setupContractErrorHandling = (DefaultContract: typeof Contract) => {
  class ExecuteContract extends DefaultContract {
    _options: Record<string, unknown> | undefined; // eslint-disable-line no-underscore-dangle

    constructor(jsonInterface: AbiItem[], address: string, options?: Record<string, unknown>) {
      // eslint-disable-line @typescript-eslint/no-useless-constructor
      super(jsonInterface, address, options);
      this._options = options; // eslint-disable-line no-underscore-dangle
    }

    // eslint-disable-next-line no-underscore-dangle
    _executeMethod(...args: any) {
      // @ts-expect-error _executeMethod is set on Web3.eth.Contract Function
      const oldExecute = DefaultContract.prototype._executeMethod; // eslint-disable-line no-underscore-dangle
      try {
        return oldExecute.call(this, ...args);
      } catch (err) {
        const e = err as
          | Error
          | TransactionError
          | ConnectionError
          | RevertInstructionError
          | TransactionRevertInstructionError;
        const request = {
          // @ts-expect-error property setup on the Web3.eth.Contract Function
          arguments: this.arguments,
        };
        const response = {
          receipt: 'receipt' in e ? e.receipt : undefined,
          reason: 'reason' in e ? e.reason : undefined,
          signature: 'signature' in e ? e.signature : undefined,
        };
        const code = 'code' in e ? e.code : undefined;
        throw new ContractError(e.message, code, this._options, request, response); // eslint-disable-line no-underscore-dangle
      }
    }
  }
  return ExecuteContract;
};

export default setupContractErrorHandling;

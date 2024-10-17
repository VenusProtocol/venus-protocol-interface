import type { IsolatedPoolComptroller } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface UpdatePoolDelegateStatusInput {
  poolComptrollerContract: IsolatedPoolComptroller;
  delegateeAddress: string;
  approvedStatus: boolean;
}

type UpdatePoolDelegateStatusOutput = ContractTxData<IsolatedPoolComptroller, 'updateDelegate'>;

const updateDelegate = ({
  poolComptrollerContract,
  delegateeAddress,
  approvedStatus,
}: UpdatePoolDelegateStatusInput): UpdatePoolDelegateStatusOutput => ({
  contract: poolComptrollerContract,
  methodName: 'updateDelegate',
  args: [delegateeAddress, approvedStatus],
});

export default updateDelegate;

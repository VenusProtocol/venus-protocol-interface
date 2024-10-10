import type { IsolatedPoolComptroller } from 'libs/contracts';
import type { ContractTxData } from 'types';

export interface UpdatePoolDelegateStatusInput {
  poolComptrollerContract: IsolatedPoolComptroller;
  delegateeAddress: string;
  approvedStatus: boolean;
}

type UpdatePoolDelegateStatusOutput = ContractTxData<IsolatedPoolComptroller, 'updateDelegate'>;

const updateDelegate = async ({
  poolComptrollerContract,
  delegateeAddress,
  approvedStatus,
}: UpdatePoolDelegateStatusInput): Promise<UpdatePoolDelegateStatusOutput> => ({
  contract: poolComptrollerContract,
  methodName: 'updateDelegate',
  args: [delegateeAddress, approvedStatus],
});

export default updateDelegate;

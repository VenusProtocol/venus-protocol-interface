import type { IsolatedPoolComptroller } from 'libs/contracts';
import { requestGaslessTransaction } from 'utilities/requestGaslessTransaction';

export interface UpdatePoolDelegateStatusInput {
  poolComptrollerContract: IsolatedPoolComptroller;
  delegateeAddress: string;
  approvedStatus: boolean;
}

const updateDelegate = async ({
  poolComptrollerContract,
  delegateeAddress,
  approvedStatus,
}: UpdatePoolDelegateStatusInput) =>
  requestGaslessTransaction(
    poolComptrollerContract,
    'updateDelegate',
    delegateeAddress,
    approvedStatus,
  );

export default updateDelegate;

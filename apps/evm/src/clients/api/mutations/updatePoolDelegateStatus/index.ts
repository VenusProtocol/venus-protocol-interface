import { IsolatedPoolComptroller } from 'libs/contracts';

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
  poolComptrollerContract.updateDelegate(delegateeAddress, approvedStatus);

export default updateDelegate;

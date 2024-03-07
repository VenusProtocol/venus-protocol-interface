import { useGetPoolDelegateApprovalStatus, useUpdatePoolDelegateStatus } from 'clients/api';
import { useAccountAddress } from 'libs/wallet';

export interface UseDelegateApprovalInput {
  poolComptrollerAddress: string;
  delegateeAddress: string;
  enabled: boolean;
}

export interface UseDelegateApprovalOutput {
  updatePoolDelegateStatus: ({ approvedStatus }: { approvedStatus: boolean }) => Promise<unknown>;
  isUseUpdatePoolDelegateStatusLoading: boolean;
  isDelegateApproved: boolean | undefined;
  isDelegateApprovedLoading: boolean;
}

const useDelegateApproval = ({
  poolComptrollerAddress,
  delegateeAddress,
  enabled,
}: UseDelegateApprovalInput): UseDelegateApprovalOutput => {
  const { accountAddress } = useAccountAddress();

  const { mutateAsync: updatePoolDelegateStatus, isLoading: isUseUpdatePoolDelegateStatusLoading } =
    useUpdatePoolDelegateStatus(
      {
        delegateeAddress,
        poolComptrollerAddress,
      },
      {
        waitForConfirmation: true,
      },
    );

  const { data: isDelegateApprovedData, isLoading: isDelegateApprovedLoading } =
    useGetPoolDelegateApprovalStatus(
      {
        poolComptrollerAddress,
        delegateeAddress,
        accountAddress: accountAddress || '',
      },
      {
        enabled: enabled && !!delegateeAddress && !!accountAddress,
      },
    );

  const isDelegateApproved = isDelegateApprovedData
    ? isDelegateApprovedData.isDelegateeApproved
    : undefined;

  return {
    updatePoolDelegateStatus,
    isUseUpdatePoolDelegateStatusLoading,
    isDelegateApproved,
    isDelegateApprovedLoading,
  };
};

export default useDelegateApproval;

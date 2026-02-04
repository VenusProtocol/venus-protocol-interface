import { useGetPoolDelegateApprovalStatus, useUpdatePoolDelegateStatus } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useAccountAddress } from 'libs/wallet';
import type { Address } from 'viem';

export interface UseDelegateApprovalInput {
  poolComptrollerAddress: Address;
  delegateeAddress: Address;
  enabled?: boolean;
}

export interface UseDelegateApprovalOutput {
  updatePoolDelegateStatus: ({ approvedStatus }: { approvedStatus: boolean }) => Promise<unknown>;
  isUpdateDelegateStatusLoading: boolean;
  isDelegateApproved: boolean | undefined;
  isDelegateApprovedLoading: boolean;
}

const useDelegateApproval = ({
  poolComptrollerAddress,
  delegateeAddress,
  enabled = true,
}: UseDelegateApprovalInput): UseDelegateApprovalOutput => {
  const { accountAddress } = useAccountAddress();

  const {
    mutateAsync: updatePoolDelegateStatusMutation,
    isPending: isUpdateDelegateStatusLoading,
  } = useUpdatePoolDelegateStatus({
    waitForConfirmation: true,
  });

  const updatePoolDelegateStatus = (input: { approvedStatus: boolean }) =>
    updatePoolDelegateStatusMutation({
      poolComptrollerAddress,
      delegateeAddress,
      ...input,
    });

  const { data: isDelegateApprovedData, isLoading: isDelegateApprovedLoading } =
    useGetPoolDelegateApprovalStatus(
      {
        poolComptrollerAddress,
        delegateeAddress,
        accountAddress: accountAddress || NULL_ADDRESS,
      },
      {
        enabled: enabled && !!delegateeAddress && !!accountAddress,
      },
    );

  const isDelegateApproved = enabled ? isDelegateApprovedData?.isDelegateeApproved : undefined;

  return {
    updatePoolDelegateStatus,
    isUpdateDelegateStatusLoading,
    isDelegateApproved,
    isDelegateApprovedLoading,
  };
};

export default useDelegateApproval;

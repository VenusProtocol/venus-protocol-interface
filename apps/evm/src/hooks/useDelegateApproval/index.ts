import { useGetPoolDelegateApprovalStatus, useUpdatePoolDelegateStatus } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import { useAccountAddress } from 'libs/wallet';
import type { Address } from 'viem';

export interface UseDelegateApprovalInput {
  poolComptrollerAddress: Address;
  delegateeAddress: Address;
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

  const { mutateAsync: updatePoolDelegateStatus, isPending: isUseUpdatePoolDelegateStatusLoading } =
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
        accountAddress: accountAddress || NULL_ADDRESS,
      },
      {
        enabled: enabled && !!delegateeAddress && !!accountAddress,
      },
    );

  const isDelegateApproved = enabled ? isDelegateApprovedData?.isDelegateeApproved : undefined;

  return {
    updatePoolDelegateStatus,
    isUseUpdatePoolDelegateStatusLoading,
    isDelegateApproved,
    isDelegateApprovedLoading,
  };
};

export default useDelegateApproval;

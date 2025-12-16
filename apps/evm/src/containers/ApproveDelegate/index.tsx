import type { Address } from 'viem';

import { ApprovalSteps } from 'components';
import useDelegateApproval from 'hooks/useDelegateApproval';
import { useTranslation } from 'libs/translations';

export interface ApproveDelegateProps {
  poolComptrollerContractAddress: Address;
  delegateeAddress: Address;
  secondStepButtonLabel: string;
  children: React.ReactNode;
}

export const ApproveDelegate: React.FC<ApproveDelegateProps> = ({
  poolComptrollerContractAddress,
  delegateeAddress,
  secondStepButtonLabel,
  children,
}) => {
  const { t } = useTranslation();

  const {
    isUpdateDelegateStatusLoading,
    updatePoolDelegateStatus,
    isDelegateApproved,
    isDelegateApprovedLoading,
  } = useDelegateApproval({
    delegateeAddress,
    poolComptrollerAddress: poolComptrollerContractAddress,
  });

  const approveDelegate = () => {
    return updatePoolDelegateStatus({ approvedStatus: true });
  };

  const showApproveDelegateStep =
    !isDelegateApprovedLoading && isDelegateApproved !== undefined && !isDelegateApproved;

  return (
    <ApprovalSteps
      showApprovalSteps={showApproveDelegateStep}
      isApprovalActionLoading={isUpdateDelegateStatusLoading}
      approvalAction={approveDelegate}
      firstStepLabel={t('approveDelegateSteps.step1')}
      firstStepTooltip={t('approveDelegateSteps.approveDelegateButton.tooltip')}
      firstStepButtonLabel={t('approveDelegateSteps.approveDelegateButton.text')}
      secondStepLabel={t('approveTokenSteps.step2')}
      secondStepButtonLabel={secondStepButtonLabel}
    >
      {children}
    </ApprovalSteps>
  );
};

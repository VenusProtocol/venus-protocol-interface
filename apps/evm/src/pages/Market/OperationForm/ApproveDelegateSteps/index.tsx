import { useTranslation } from 'libs/translations';

import { ApprovalSteps, type ApprovalStepsProps } from 'components';

export interface ApproveDelegateStepsProps
  extends Pick<ApprovalStepsProps, 'secondStepButtonLabel' | 'className' | 'children'> {
  approveDelegateeAction: () => Promise<unknown>;
  isDelegateeApprovedLoading: boolean;
  isApproveDelegateeLoading: boolean;
  hideDelegateeApprovalStep?: boolean;
  isDelegateeApproved?: boolean;
}

export const ApproveDelegateSteps: React.FC<ApproveDelegateStepsProps> = ({
  approveDelegateeAction,
  isDelegateeApproved,
  isDelegateeApprovedLoading,
  isApproveDelegateeLoading,
  children,
  hideDelegateeApprovalStep,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const showApproveDelegateStep =
    !isDelegateeApprovedLoading &&
    isDelegateeApproved !== undefined &&
    !isDelegateeApproved &&
    !hideDelegateeApprovalStep;

  return (
    <ApprovalSteps
      showApprovalSteps={showApproveDelegateStep}
      isApprovalActionLoading={isApproveDelegateeLoading}
      approvalAction={approveDelegateeAction}
      firstStepLabel={t('approveDelegateSteps.step1')}
      firstStepTooltip={t('approveDelegateSteps.approveDelegateButton.tooltip')}
      firstStepButtonLabel={t('approveDelegateSteps.approveDelegateButton.text')}
      secondStepLabel={t('approveTokenSteps.step2')}
      {...otherProps}
    >
      {children}
    </ApprovalSteps>
  );
};

import { useTranslation } from 'libs/translations';

import { ApprovalSteps, type ApprovalStepsProps } from '..';

export type ApproveDelegateStepsProps = {
  approveDelegateeAction: () => Promise<unknown>;
  isDelegateeApproved: boolean | undefined;
  isDelegateeApprovedLoading: boolean;
  isApproveDelegateeLoading: boolean;
  hideDelegateeApprovalStep?: boolean;
} & ApprovalStepsProps;

export const ApproveDelegateSteps: React.FC<ApproveDelegateStepsProps> = ({
  approveDelegateeAction,
  isDelegateeApproved,
  isDelegateeApprovedLoading,
  isApproveDelegateeLoading,
  secondStepButtonLabel,
  className,
  children,
  hideDelegateeApprovalStep,
}) => {
  const { t } = useTranslation();

  const showApproveDelegateStep =
    !isDelegateeApprovedLoading &&
    isDelegateeApproved !== undefined &&
    !isDelegateeApproved &&
    !hideDelegateeApprovalStep;

  return (
    <ApprovalSteps
      className={className}
      showApprovalSteps={showApproveDelegateStep}
      isApprovalActionLoading={isApproveDelegateeLoading}
      approvalAction={approveDelegateeAction}
      firstStepLabel={t('approveDelegateSteps.step1')}
      firstStepTooltip={t('approveDelegateSteps.approveDelegateButton.tooltip')}
      firstStepButtonLabel={t('approveDelegateSteps.approveDelegateButton.text')}
      secondStepLabel={t('approveTokenSteps.step2')}
      secondStepButtonLabel={secondStepButtonLabel}
      isApproved={isDelegateeApproved}
    >
      {children}
    </ApprovalSteps>
  );
};

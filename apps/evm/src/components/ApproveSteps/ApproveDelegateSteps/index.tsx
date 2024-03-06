import { useTranslation } from 'libs/translations';

import { ApprovalSteps, ApprovalStepsProps } from '..';

export type ApproveDelegateStepsProps = {
  approveDelegateAction: () => Promise<unknown>;
  isDelegateApproved: boolean | undefined;
  isDelegateApprovedLoading: boolean;
  isApproveDelegateLoading: boolean;
} & ApprovalStepsProps;

export const ApproveDelegateSteps: React.FC<ApproveDelegateStepsProps> = ({
  approveDelegateAction,
  isDelegateApproved,
  isDelegateApprovedLoading,
  isApproveDelegateLoading,
  secondStepButtonLabel,
  className,
  children,
}) => {
  const { t } = useTranslation();

  const showApproveDelegateStep =
    !isDelegateApprovedLoading && isDelegateApproved !== undefined && !isDelegateApproved;

  return (
    <ApprovalSteps
      className={className}
      showApprovalSteps={showApproveDelegateStep}
      isApprovalActionLoading={isApproveDelegateLoading}
      approvalAction={approveDelegateAction}
      firstStepLabel={t('approveDelegateSteps.step1')}
      firstStepTooltip={t('approveDelegateSteps.approveDelegateButton.tooltip')}
      firstStepButtonLabel={t('approveDelegateSteps.approveDelegateButton.text')}
      secondStepLabel={t('approveTokenSteps.step2')}
      secondStepButtonLabel={secondStepButtonLabel}
      isApproved={isDelegateApproved}
    >
      {children}
    </ApprovalSteps>
  );
};

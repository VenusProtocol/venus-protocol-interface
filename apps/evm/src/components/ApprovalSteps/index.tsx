import { handleError } from 'libs/errors';

import { PrimaryButton } from '@venusprotocol/ui';
import { InfoIcon } from 'components/InfoIcon';

export interface ApprovalStepsProps {
  children: React.ReactNode;
  approvalAction: () => Promise<unknown>;
  showApprovalSteps: boolean;
  isApprovalActionLoading: boolean;
  firstStepLabel: string;
  firstStepButtonLabel: string;
  secondStepLabel: string;
  secondStepButtonLabel: string;
  firstStepTooltip?: string;
  className?: string;
}

export const ApprovalSteps: React.FC<ApprovalStepsProps> = ({
  approvalAction,
  showApprovalSteps,
  isApprovalActionLoading,
  firstStepLabel,
  firstStepButtonLabel,
  firstStepTooltip,
  secondStepLabel,
  secondStepButtonLabel,
  className,
  children,
}) => {
  const handleApprovalAction = async () => {
    try {
      await approvalAction();
    } catch (error) {
      handleError({ error });
    }
  };

  return (
    <div className={className}>
      {showApprovalSteps ? (
        <>
          <div className="mb-1 flex items-center">
            <p className="text-sm font-semibold text-white">{firstStepLabel}</p>

            {firstStepTooltip && <InfoIcon className="ml-2 flex" tooltip={firstStepTooltip} />}
          </div>

          <PrimaryButton
            onClick={handleApprovalAction}
            loading={isApprovalActionLoading}
            className="mb-8 w-full"
          >
            {firstStepButtonLabel}
          </PrimaryButton>

          <div className="mb-1 flex items-center">
            <p className="text-sm font-semibold text-white">{secondStepLabel}</p>
          </div>

          <PrimaryButton className="w-full" disabled>
            {secondStepButtonLabel}
          </PrimaryButton>
        </>
      ) : (
        children
      )}
    </div>
  );
};

/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';

import { handleError } from 'libs/errors';

import { PrimaryButton } from '@venusprotocol/ui';
import { InfoIcon } from 'components/InfoIcon';
import { useStyles } from './styles';

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
  const styles = useStyles();

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
          <div css={styles.buttonLabelContainer}>
            <Typography variant="small1" component="label" css={styles.buttonLabel}>
              {firstStepLabel}
            </Typography>

            {firstStepTooltip && <InfoIcon className="flex ml-2" tooltip={firstStepTooltip} />}
          </div>

          <PrimaryButton
            onClick={handleApprovalAction}
            loading={isApprovalActionLoading}
            className="mb-8 w-full"
          >
            {firstStepButtonLabel}
          </PrimaryButton>

          <div css={styles.buttonLabelContainer}>
            <Typography variant="small1" component="label" css={styles.buttonLabel}>
              {secondStepLabel}
            </Typography>
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

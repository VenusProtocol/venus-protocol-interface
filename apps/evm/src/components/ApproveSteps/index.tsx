/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';

import { displayMutationError } from 'libs/errors';

import { PrimaryButton } from '../Button';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';

export interface ApprovalStepsProps {
  children: React.ReactNode;
  className?: string;
  secondStepButtonLabel: string;
}

interface AprrovalStepsExtraProps {
  approvalAction: () => Promise<unknown>;
  showApprovalSteps: boolean;
  isApprovalActionLoading: boolean;
  isApproved: boolean | undefined;
  firstStepLabel: string;
  firstStepButtonLabel: string;
  firstStepTooltip?: string;
  secondStepLabel: string;
}

export const ApprovalSteps: React.FC<ApprovalStepsProps & AprrovalStepsExtraProps> = ({
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
      displayMutationError({ error });
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

            {firstStepTooltip && (
              <Tooltip title={firstStepTooltip} css={styles.approveTokenTooltip}>
                <Icon name="info" />
              </Tooltip>
            )}
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

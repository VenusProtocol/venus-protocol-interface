import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import { ApprovalSteps, type ApprovalStepsProps } from '../ApprovalSteps';

// TODO: remove in favor of using ApproveToken container

export interface ApproveTokenStepsProps
  extends Pick<ApprovalStepsProps, 'className' | 'children' | 'secondStepButtonLabel'> {
  token: Token;
  approveToken: () => Promise<unknown>;
  isWalletSpendingLimitLoading: boolean;
  isApproveTokenLoading: boolean;
  isTokenApproved?: boolean;
  hideTokenEnablingStep?: boolean;
}

export const ApproveTokenSteps: React.FC<ApproveTokenStepsProps> = ({
  token,
  approveToken,
  isTokenApproved,
  isWalletSpendingLimitLoading,
  isApproveTokenLoading,
  hideTokenEnablingStep,
  className,
  children,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const showApproveTokenStep =
    !hideTokenEnablingStep && !isWalletSpendingLimitLoading && !isTokenApproved;

  return (
    <ApprovalSteps
      showApprovalSteps={showApproveTokenStep}
      isApprovalActionLoading={isApproveTokenLoading}
      approvalAction={approveToken}
      firstStepLabel={t('approveTokenSteps.step1')}
      firstStepTooltip={t('approveTokenSteps.approveTokenButton.tooltip')}
      firstStepButtonLabel={t('approveTokenSteps.approveTokenButton.text', {
        tokenSymbol: token.symbol,
      })}
      secondStepLabel={t('approveTokenSteps.step2')}
      {...otherProps}
    >
      {children}
    </ApprovalSteps>
  );
};

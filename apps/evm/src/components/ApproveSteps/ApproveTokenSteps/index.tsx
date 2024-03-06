import { useTranslation } from 'libs/translations';
import { Token } from 'types';

import { ApprovalSteps, ApprovalStepsProps } from '..';

export type ApproveTokenStepsProps = {
  token: Token;
  approveToken: () => Promise<unknown>;
  isTokenApproved: boolean | undefined;
  isWalletSpendingLimitLoading: boolean;
  isApproveTokenLoading: boolean;
  isUsingSwap?: boolean;
  hideTokenEnablingStep?: boolean;
} & ApprovalStepsProps;

export const ApproveTokenSteps: React.FC<ApproveTokenStepsProps> = ({
  token,
  approveToken,
  isTokenApproved,
  isWalletSpendingLimitLoading,
  isApproveTokenLoading,
  hideTokenEnablingStep,
  isUsingSwap = false,
  secondStepButtonLabel,
  className,
  children,
}) => {
  const { t } = useTranslation();

  const showApproveTokenStep =
    !hideTokenEnablingStep && !isWalletSpendingLimitLoading && !isTokenApproved;

  return (
    <ApprovalSteps
      className={className}
      showApprovalSteps={showApproveTokenStep}
      isApprovalActionLoading={isApproveTokenLoading}
      approvalAction={approveToken}
      firstStepLabel={t('approveTokenSteps.step1')}
      firstStepTooltip={isUsingSwap ? t('approveTokenSteps.approveTokenButton.tooltip') : undefined}
      firstStepButtonLabel={t('approveTokenSteps.approveTokenButton.text', {
        tokenSymbol: token.symbol,
      })}
      secondStepLabel={t('approveTokenSteps.step2')}
      secondStepButtonLabel={secondStepButtonLabel}
      isApproved={isTokenApproved}
    >
      {children}
    </ApprovalSteps>
  );
};

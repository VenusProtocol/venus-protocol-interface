import { ApproveTokenSteps } from 'components';
import { FormikSubmitButton } from 'containers/Form';
import { SwitchChain } from 'containers/SwitchChain';
import type { Token } from 'types';
import { cn } from 'utilities';

export interface SubmitSectionProps {
  token: Token;
  approveToken: () => Promise<unknown>;
  tokenNeedsToBeApproved: boolean;
  isFormValid: boolean;
  isSubmitting: boolean;
  isTokenApproved: boolean;
  isApproveTokenLoading: boolean;
  isWalletSpendingLimitLoading: boolean;
  isRevokeWalletSpendingLimitLoading: boolean;
  submitButtonEnabledLabel: string;
  submitButtonDisabledLabel: string;
  isDangerousAction: boolean;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  token,
  tokenNeedsToBeApproved,
  approveToken,
  isFormValid,
  isSubmitting,
  isTokenApproved,
  isApproveTokenLoading,
  isWalletSpendingLimitLoading,
  isRevokeWalletSpendingLimitLoading,
  submitButtonEnabledLabel,
  submitButtonDisabledLabel,
  isDangerousAction,
}) => {
  let dom = (
    <FormikSubmitButton
      loading={isSubmitting}
      disabled={
        !isFormValid ||
        isSubmitting ||
        !isTokenApproved ||
        isWalletSpendingLimitLoading ||
        isRevokeWalletSpendingLimitLoading
      }
      className={cn('w-full', isDangerousAction && 'border-red bg-red')}
      enabledLabel={submitButtonEnabledLabel}
      disabledLabel={submitButtonDisabledLabel}
    />
  );

  if (isFormValid && tokenNeedsToBeApproved) {
    dom = (
      <ApproveTokenSteps
        token={token}
        isTokenApproved={isTokenApproved}
        approveToken={approveToken}
        isApproveTokenLoading={isApproveTokenLoading}
        isWalletSpendingLimitLoading={isWalletSpendingLimitLoading}
        secondStepButtonLabel={submitButtonEnabledLabel}
      >
        {dom}
      </ApproveTokenSteps>
    );
  }

  if (isFormValid) {
    dom = <SwitchChain>{dom}</SwitchChain>;
  }

  return dom;
};

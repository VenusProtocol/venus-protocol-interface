import { type Control, useFormState } from 'react-hook-form';

import { type ButtonProps, PrimaryButton } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { cn } from 'utilities';

import { ApproveTokenSteps, type ApproveTokenStepsProps } from './ApproveTokenSteps';

export interface RhfSubmitButtonProps extends ButtonProps {
  control: Control<any>;
  enabledLabel: string;
  disabledLabel: string;
  isDangerousSubmission?: boolean;
  requiresConnectedWallet?: boolean;
  spendingApproval?: Omit<ApproveTokenStepsProps, 'children' | 'secondStepButtonLabel'>;
}

export const RhfSubmitButton: React.FC<RhfSubmitButtonProps> = ({
  control,
  enabledLabel,
  disabledLabel,
  isDangerousSubmission = false,
  requiresConnectedWallet = false,
  spendingApproval,
  className,
  disabled,
  loading,
  ...otherButtonProps
}) => {
  const formState = useFormState({ control });

  let dom = (
    <PrimaryButton
      type="submit"
      loading={formState.isSubmitting || loading}
      disabled={!formState.isValid || formState.isSubmitting || disabled}
      className={cn('w-full', isDangerousSubmission && 'bg-red')}
      {...otherButtonProps}
    >
      {formState.isValid ? enabledLabel : disabledLabel}
    </PrimaryButton>
  );

  if (spendingApproval) {
    dom = (
      <ApproveTokenSteps secondStepButtonLabel={enabledLabel} {...spendingApproval}>
        {dom}
      </ApproveTokenSteps>
    );
  }

  if (requiresConnectedWallet || spendingApproval) {
    dom = <ConnectWallet buttonVariant="primary">{dom}</ConnectWallet>;
  }

  return <div className={className}>{dom}</div>;
};

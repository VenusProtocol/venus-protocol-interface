import { type Control, useFormState } from 'react-hook-form';

import { cn } from '@venusprotocol/ui';
import { type ButtonProps, PrimaryButton } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';

import type { ChainId } from '@venusprotocol/chains';
import { SwitchChain } from 'containers/SwitchChain';
import { ApproveTokenSteps, type ApproveTokenStepsProps } from './ApproveTokenSteps';

export interface RhfSubmitButtonProps extends ButtonProps {
  control: Control<any>;
  enabledLabel: string;
  disabledLabel: string;
  isDangerousSubmission?: boolean;
  requiresConnectedWallet?:
    | boolean
    | {
        chainId: ChainId;
      };
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
      className={cn('w-full', isDangerousSubmission && 'bg-red border-red')}
      {...otherButtonProps}
    >
      {formState.isValid ? enabledLabel : disabledLabel}
    </PrimaryButton>
  );

  if (formState.isValid && spendingApproval) {
    dom = (
      <ApproveTokenSteps secondStepButtonLabel={enabledLabel} {...spendingApproval}>
        {dom}
      </ApproveTokenSteps>
    );
  }

  if (formState.isValid && (requiresConnectedWallet || spendingApproval)) {
    dom = (
      <ConnectWallet>
        <SwitchChain
          chainId={
            typeof requiresConnectedWallet !== 'boolean'
              ? requiresConnectedWallet.chainId
              : undefined
          }
        >
          {dom}
        </SwitchChain>
      </ConnectWallet>
    );
  }

  return <div className={className}>{dom}</div>;
};

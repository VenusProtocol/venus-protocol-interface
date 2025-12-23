import type { ChainId } from '@venusprotocol/chains';
import { type Control, useFormState } from 'react-hook-form';

import { type ButtonProps, PrimaryButton } from 'components';
import { ApproveToken, type ApproveTokenProps } from 'containers/ApproveToken';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwitchChain } from 'containers/SwitchChain';

export interface RhfSubmitButtonProps extends ButtonProps {
  control: Control<any>;
  enabledLabel: string;
  disabledLabel: string;
  requiresConnectedWallet?:
    | boolean
    | {
        chainId: ChainId;
      };
  spendingApproval?: Omit<ApproveTokenProps, 'children' | 'secondStepButtonLabel'>;
  analyticVariant?: string;
}

export const RhfSubmitButton: React.FC<RhfSubmitButtonProps> = ({
  control,
  enabledLabel,
  disabledLabel,
  requiresConnectedWallet = false,
  spendingApproval,
  className,
  disabled,
  loading,
  analyticVariant,
  ...otherButtonProps
}) => {
  const formState = useFormState({ control });

  let dom = (
    <PrimaryButton
      type="submit"
      loading={formState.isSubmitting || loading}
      disabled={!formState.isValid || formState.isSubmitting || disabled}
      className="w-full"
      {...otherButtonProps}
    >
      {formState.isValid ? enabledLabel : disabledLabel}
    </PrimaryButton>
  );

  if (formState.isValid && spendingApproval) {
    dom = (
      <ApproveToken secondStepButtonLabel={enabledLabel} {...spendingApproval}>
        {dom}
      </ApproveToken>
    );
  }

  if (requiresConnectedWallet || spendingApproval) {
    dom = (
      <ConnectWallet analyticVariant={analyticVariant}>
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

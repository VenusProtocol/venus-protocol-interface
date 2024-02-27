import { Control, useFormState } from 'react-hook-form';

import { PrimaryButton } from 'components';
import { ConnectWallet } from 'containers/ConnectWallet';
import { cn } from 'utilities';

export interface RhfSubmitButtonProps {
  control: Control<any>;
  enabledLabel: string;
  disabledLabel: string;
  isDangerousSubmission: boolean;
  requiresConnectedWallet?: boolean;
}

export const RhfSubmitButton: React.FC<RhfSubmitButtonProps> = ({
  control,
  isDangerousSubmission,
  enabledLabel,
  disabledLabel,
  requiresConnectedWallet = false,
}) => {
  const formState = useFormState({ control });

  let dom = (
    <PrimaryButton
      type="submit"
      loading={formState.isSubmitting}
      disabled={!formState.isValid || formState.isSubmitting}
      className={cn('w-full', isDangerousSubmission && 'bg-red')}
    >
      {formState.isValid ? enabledLabel : disabledLabel}
    </PrimaryButton>
  );

  if (requiresConnectedWallet) {
    dom = <ConnectWallet buttonVariant="primary">{dom}</ConnectWallet>;
  }

  return dom;
};

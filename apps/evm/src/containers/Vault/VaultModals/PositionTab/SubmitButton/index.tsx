import { cn } from '@venusprotocol/ui';

import { PrimaryButton } from 'components';
import { ApproveDelegate } from 'containers/ApproveDelegate';
import { ApproveToken } from 'containers/ApproveToken';
import { SwitchChain } from 'containers/SwitchChain';
import type { Approval } from './types';

export interface SubmitButtonProps {
  label: string;
  isFormValid: boolean;
  approval?: Approval;
  isLoading?: boolean;
  disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  isFormValid,
  label,
  approval,
  disabled,
}) => {
  let dom = (
    <PrimaryButton
      type="submit"
      loading={isLoading}
      disabled={!isFormValid || disabled}
      className={cn('w-full')}
    >
      {label}
    </PrimaryButton>
  );

  // Only display approval steps if one is required and form is valid
  if (isFormValid && approval?.type === 'token') {
    dom = (
      <ApproveToken
        token={approval.token}
        spenderAddress={approval.spenderAddress}
        secondStepButtonLabel={label}
      >
        {dom}
      </ApproveToken>
    );
  } else if (isFormValid && approval?.type === 'delegate') {
    dom = (
      <ApproveDelegate
        poolComptrollerContractAddress={approval.poolComptrollerContractAddress}
        delegateeAddress={approval.delegateeAddress}
        secondStepButtonLabel={label}
      >
        {dom}
      </ApproveDelegate>
    );
  }

  return <SwitchChain>{dom}</SwitchChain>;
};

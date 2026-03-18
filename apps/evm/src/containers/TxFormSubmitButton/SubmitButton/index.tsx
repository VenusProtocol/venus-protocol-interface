import { cn } from '@venusprotocol/ui';

import { PrimaryButton } from 'components';
import { ApproveDelegate } from 'containers/ApproveDelegate';
import { ApproveToken } from 'containers/ApproveToken';
import { SwitchChain } from 'containers/SwitchChain';
import type { Approval } from '../types';

export interface SubmitButtonProps {
  label: string;
  isFormValid: boolean;
  approval?: Approval;
  isRisky?: boolean;
  isLoading?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  isRisky = false,
  isFormValid,
  label,
  approval,
}) => {
  let dom = (
    <PrimaryButton
      type="submit"
      loading={isLoading}
      disabled={!isFormValid}
      className={cn('w-full', isRisky && 'border-red bg-red')}
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

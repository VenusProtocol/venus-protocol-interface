import { cn } from '@venusprotocol/ui';

import { PrimaryButton } from 'components';
import { ApproveDelegate } from 'containers/ApproveDelegate';
import { ApproveToken } from 'containers/ApproveToken';
import { SwitchChain } from 'containers/SwitchChain';
import type { Approval } from '../types';

export interface SubmitButtonProps {
  label: string;
  isFormValid: boolean;
  approval?: Approval | Approval[];
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
  const submitButtonDom = (
    <PrimaryButton
      type="submit"
      loading={isLoading}
      disabled={!isFormValid}
      className={cn('w-full', isRisky && 'border-red bg-red')}
    >
      {label}
    </PrimaryButton>
  );

  // Only display approval steps, in order, if form is valid
  const approvals = isFormValid ? ([] as Approval[]).concat(approval ?? []) : [];

  const dom = approvals.reduceRight<React.ReactNode>(
    (childrenDom, currentApproval) =>
      currentApproval.type === 'token' ? (
        <ApproveToken
          token={currentApproval.token}
          spenderAddress={currentApproval.spenderAddress}
          secondStepButtonLabel={label}
        >
          {childrenDom}
        </ApproveToken>
      ) : (
        <ApproveDelegate
          poolComptrollerContractAddress={currentApproval.poolComptrollerContractAddress}
          delegateeAddress={currentApproval.delegateeAddress}
          secondStepButtonLabel={label}
        >
          {childrenDom}
        </ApproveDelegate>
      ),
    submitButtonDom,
  );

  return <SwitchChain>{dom}</SwitchChain>;
};

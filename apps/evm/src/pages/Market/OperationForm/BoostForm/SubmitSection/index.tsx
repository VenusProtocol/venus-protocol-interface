import { cn } from '@venusprotocol/ui';
import { useMemo } from 'react';

import { PrimaryButton } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { SwitchChain } from 'containers/SwitchChain';
import useDelegateApproval from 'hooks/useDelegateApproval';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useTranslation } from 'libs/translations';
import type { Address } from 'viem';
import { ApproveDelegateSteps } from '../../ApproveDelegateSteps';
import type { FormError } from '../../types';
import type { FormErrorCode } from '../useForm';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isLoading: boolean;
  isRiskyOperation: boolean;
  poolComptrollerContractAddress: Address;
  formError?: FormError<FormErrorCode>;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isLoading,
  isRiskyOperation,
  formError,
  poolComptrollerContractAddress,
}) => {
  const { t } = useTranslation();

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  const {
    isDelegateApproved,
    isDelegateApprovedLoading,
    isUpdateDelegateStatusLoading,
    updatePoolDelegateStatus,
  } = useDelegateApproval({
    delegateeAddress: leverageManagerContractAddress || NULL_ADDRESS,
    poolComptrollerAddress: poolComptrollerContractAddress,
    enabled: !!leverageManagerContractAddress,
  });

  const approveDelegate = () => updatePoolDelegateStatus({ approvedStatus: true });

  const submitButtonLabel = useMemo(() => {
    if (!isFormValid && formError?.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT') {
      return t('operationForm.submitButtonLabel.enterValidAmount');
    }

    return t('operationForm.submitButtonLabel.boost');
  }, [isFormValid, t, formError?.code]);

  let dom = (
    <PrimaryButton
      type="submit"
      loading={isLoading}
      disabled={!isFormValid || isLoading}
      className={cn('w-full', isRiskyOperation && 'border-red bg-red')}
    >
      {submitButtonLabel}
    </PrimaryButton>
  );

  if (isFormValid) {
    dom = (
      <SwitchChain>
        <ApproveDelegateSteps
          approveDelegateeAction={approveDelegate}
          isApproveDelegateeLoading={isUpdateDelegateStatusLoading}
          isDelegateeApproved={isDelegateApproved}
          isDelegateeApprovedLoading={isDelegateApprovedLoading}
          secondStepButtonLabel={submitButtonLabel}
        >
          {dom}
        </ApproveDelegateSteps>
      </SwitchChain>
    );
  }

  return dom;
};

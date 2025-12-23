import { useMemo } from 'react';

import { PrimaryButton } from 'components';
import { SwitchChain } from 'containers/SwitchChain';
import { useTranslation } from 'libs/translations';
import { ApproveDelegateSteps, type ApproveDelegateStepsProps } from '../../ApproveDelegateSteps';
import type { FormError } from '../../types';
import type { FormErrorCode } from '../useForm';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  approveDelegateAction: ApproveDelegateStepsProps['approveDelegateeAction'];
  isApproveDelegateLoading: ApproveDelegateStepsProps['isApproveDelegateeLoading'];
  isDelegateApproved: ApproveDelegateStepsProps['isDelegateeApproved'];
  isDelegateApprovedLoading: ApproveDelegateStepsProps['isDelegateeApprovedLoading'];
  formError?: FormError<FormErrorCode>;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  formError,
  approveDelegateAction,
  isApproveDelegateLoading,
  isDelegateApproved,
  isDelegateApprovedLoading,
}) => {
  const { t } = useTranslation();

  const submitButtonLabel = useMemo(() => {
    if (!isFormValid && formError?.code !== 'REQUIRES_RISK_ACKNOWLEDGEMENT') {
      return t('operationForm.submitButtonLabel.enterValidAmount');
    }

    return t('operationForm.submitButtonLabel.borrow');
  }, [isFormValid, t, formError?.code]);

  let dom = (
    <PrimaryButton
      type="submit"
      loading={isFormSubmitting}
      disabled={!isFormValid || isFormSubmitting}
      className="w-full"
    >
      {submitButtonLabel}
    </PrimaryButton>
  );

  if (isFormValid) {
    dom = (
      <SwitchChain>
        <ApproveDelegateSteps
          approveDelegateeAction={approveDelegateAction}
          isApproveDelegateeLoading={isApproveDelegateLoading}
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

export default SubmitSection;

import { useMemo } from 'react';

import { PrimaryButton } from 'components';
import { SwitchChain } from 'containers/SwitchChain';
import { useTranslation } from 'libs/translations';
import { ApproveDelegateSteps, type ApproveDelegateStepsProps } from '../../ApproveDelegateSteps';
import type { FormErrorCode } from '../useForm';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  approveDelegateAction: ApproveDelegateStepsProps['approveDelegateeAction'];
  isApproveDelegateLoading: ApproveDelegateStepsProps['isApproveDelegateeLoading'];
  isDelegateApproved: ApproveDelegateStepsProps['isDelegateeApproved'];
  isDelegateApprovedLoading: ApproveDelegateStepsProps['isDelegateeApprovedLoading'];
  formErrorCode?: FormErrorCode;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  formErrorCode,
  approveDelegateAction,
  isApproveDelegateLoading,
  isDelegateApproved,
  isDelegateApprovedLoading,
}) => {
  const { t } = useTranslation();

  const submitButtonLabel = useMemo(() => {
    if (!isFormValid && formErrorCode !== 'REQUIRES_RISK_ACKNOWLEDGEMENT') {
      return t('operationForm.submitButtonLabel.enterValidAmount');
    }

    return t('operationForm.submitButtonLabel.borrow');
  }, [isFormValid, t, formErrorCode]);

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

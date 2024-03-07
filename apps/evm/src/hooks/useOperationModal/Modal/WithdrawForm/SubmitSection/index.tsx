/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import { ApproveDelegateSteps, ApproveDelegateStepsProps, PrimaryButton } from 'components';
import { useTranslation } from 'libs/translations';

import { FormError } from '../useForm/types';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  formError?: FormError;
  approveDelegateAction: ApproveDelegateStepsProps['approveDelegateAction'];
  isApproveDelegateLoading: ApproveDelegateStepsProps['isApproveDelegateLoading'];
  isDelegateApproved: ApproveDelegateStepsProps['isDelegateApproved'];
  isDelegateApprovedLoading: ApproveDelegateStepsProps['isDelegateApprovedLoading'];
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
    if (!isFormSubmitting && formError === 'HIGHER_THAN_WITHDRAWABLE_AMOUNT') {
      return t('operationModal.withdraw.submitButtonLabel.higherThanWithdrawableAmount');
    }

    if (!isFormValid) {
      return t('operationModal.withdraw.submitButtonLabel.enterValidAmount');
    }

    return t('operationModal.withdraw.submitButtonLabel.withdraw');
  }, [isFormValid, formError, isFormSubmitting, t]);

  return (
    <ApproveDelegateSteps
      approveDelegateAction={approveDelegateAction}
      isApproveDelegateLoading={isApproveDelegateLoading}
      isDelegateApproved={isDelegateApproved}
      isDelegateApprovedLoading={isDelegateApprovedLoading}
      secondStepButtonLabel={submitButtonLabel}
    >
      <PrimaryButton
        type="submit"
        loading={isFormSubmitting}
        disabled={!isFormValid || isFormSubmitting}
        className="w-full"
      >
        {submitButtonLabel}
      </PrimaryButton>
    </ApproveDelegateSteps>
  );
};

export default SubmitSection;

/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import { ApproveDelegateSteps, type ApproveDelegateStepsProps, PrimaryButton } from 'components';
import { useTranslation } from 'libs/translations';

import type { FormError } from '../useForm/types';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  formError?: FormError;
  approveDelegateAction: ApproveDelegateStepsProps['approveDelegateeAction'];
  isApproveDelegateLoading: ApproveDelegateStepsProps['isApproveDelegateeLoading'];
  isDelegateApproved: ApproveDelegateStepsProps['isDelegateeApproved'];
  isDelegateApprovedLoading: ApproveDelegateStepsProps['isDelegateeApprovedLoading'];
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
      approveDelegateeAction={approveDelegateAction}
      isApproveDelegateeLoading={isApproveDelegateLoading}
      isDelegateeApproved={isDelegateApproved}
      isDelegateeApprovedLoading={isDelegateApprovedLoading}
      secondStepButtonLabel={submitButtonLabel}
      hideDelegateeApprovalStep={!isFormValid}
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

/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { ApproveDelegateSteps, ApproveDelegateStepsProps, PrimaryButton } from 'components';
import { useTranslation } from 'libs/translations';
import { cn } from 'utilities';

import { FormError } from '../useForm/types';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  safeLimitTokens: string;
  fromTokenAmountTokens: string;
  formError?: FormError;
  approveDelegateAction: ApproveDelegateStepsProps['approveDelegateAction'];
  isApproveDelegateLoading: ApproveDelegateStepsProps['isApproveDelegateLoading'];
  isDelegateApproved: ApproveDelegateStepsProps['isDelegateApproved'];
  isDelegateApprovedLoading: ApproveDelegateStepsProps['isDelegateApprovedLoading'];
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  safeLimitTokens,
  fromTokenAmountTokens,
  formError,
  approveDelegateAction,
  isApproveDelegateLoading,
  isDelegateApproved,
  isDelegateApprovedLoading,
}) => {
  const { t } = useTranslation();

  const isDangerous = useMemo(
    () => new BigNumber(fromTokenAmountTokens).isGreaterThanOrEqualTo(safeLimitTokens),
    [fromTokenAmountTokens, safeLimitTokens],
  );

  const submitButtonLabel = useMemo(() => {
    if (!isFormSubmitting && formError === 'BORROW_CAP_ALREADY_REACHED') {
      return t('operationModal.borrow.submitButtonLabel.borrowCapReached');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_BORROWABLE_AMOUNT') {
      return t('operationModal.borrow.submitButtonLabel.amountHigherThanBorrowableAmount');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_BORROW_CAP') {
      return t('operationModal.borrow.submitButtonLabel.amountHigherThanBorrowCap');
    }

    if (!isFormValid) {
      return t('operationModal.borrow.submitButtonLabel.enterValidAmount');
    }

    if (!isFormSubmitting && isDangerous) {
      return t('operationModal.borrow.submitButtonLabel.borrowHighRiskAmount');
    }

    return t('operationModal.borrow.submitButtonLabel.borrow');
  }, [isFormValid, formError, isDangerous, isFormSubmitting, t]);

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
        className={cn('w-full', isDangerous && 'border-red bg-red')}
      >
        {submitButtonLabel}
      </PrimaryButton>
    </ApproveDelegateSteps>
  );
};

export default SubmitSection;

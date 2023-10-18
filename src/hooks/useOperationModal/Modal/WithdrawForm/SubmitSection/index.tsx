/** @jsxImportSource @emotion/react */
import { PrimaryButton } from 'components';
import { useMemo } from 'react';
import * as React from 'react';
import { useTranslation } from 'translation';

import { FormError } from '../useForm/types';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  fromTokenAmountTokens: string;
  formError?: FormError;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  fromTokenAmountTokens,
  formError,
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
  }, [fromTokenAmountTokens, isFormValid, formError, isFormSubmitting]);

  return (
    <PrimaryButton
      type="submit"
      loading={isFormSubmitting}
      disabled={!isFormValid || isFormSubmitting}
      className="w-full"
    >
      {submitButtonLabel}
    </PrimaryButton>
  );
};

export default SubmitSection;

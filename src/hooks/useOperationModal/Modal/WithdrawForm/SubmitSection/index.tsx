/** @jsxImportSource @emotion/react */
import { PrimaryButton } from 'components';
import { useTranslation } from 'packages/translations';
import React, { useMemo } from 'react';

import { FormError } from '../useForm/types';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  formError?: FormError;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
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
  }, [isFormValid, formError, isFormSubmitting, t]);

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

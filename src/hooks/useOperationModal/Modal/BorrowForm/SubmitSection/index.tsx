/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { PrimaryButton } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';

import { useStyles as useSharedStyles } from '../../styles';
import { FormError } from '../useForm/types';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  safeLimitTokens: string;
  fromTokenAmountTokens: string;
  formError?: FormError;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  safeLimitTokens,
  fromTokenAmountTokens,
  formError,
}) => {
  const { t } = useTranslation();
  const sharedStyles = useSharedStyles();

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
  }, [fromTokenAmountTokens, isFormValid, formError, isDangerous, isFormSubmitting]);

  return (
    <PrimaryButton
      css={sharedStyles.getSubmitButton({ isDangerous })}
      type="submit"
      loading={isFormSubmitting}
      disabled={!isFormValid || isFormSubmitting}
      fullWidth
    >
      {submitButtonLabel}
    </PrimaryButton>
  );
};

export default SubmitSection;

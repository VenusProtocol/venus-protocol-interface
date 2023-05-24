/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { PrimaryButton } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';

import { FormError } from '../useForm/types';
import { useStyles } from './styles';

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
  const styles = useStyles();

  const isHighRiskBorrow = useMemo(
    () => new BigNumber(fromTokenAmountTokens).isGreaterThanOrEqualTo(safeLimitTokens),
    [fromTokenAmountTokens, safeLimitTokens],
  );

  const submitButtonLabel = useMemo(() => {
    if (!isFormSubmitting && formError === 'BORROW_CAP_ALREADY_REACHED') {
      return t('borrowRepayModal.borrow.submitButtonLabel.borrowCapReached');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_BORROWABLE_AMOUNT') {
      return t('borrowRepayModal.borrow.submitButtonLabel.amountHigherThanBorrowableAmount');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_BORROW_CAP') {
      return t('borrowRepayModal.borrow.submitButtonLabel.amountHigherThanBorrowCap');
    }

    if (!isFormValid) {
      return t('borrowRepayModal.borrow.submitButtonLabel.enterValidAmount');
    }

    if (!isFormSubmitting && isHighRiskBorrow) {
      return t('borrowRepayModal.borrow.submitButtonLabel.borrowHighRiskAmount');
    }

    return t('borrowRepayModal.borrow.submitButtonLabel.borrow');
  }, [fromTokenAmountTokens, isFormValid, formError, isHighRiskBorrow, isFormSubmitting]);

  return (
    <PrimaryButton
      css={styles.getSubmitButton({ isHighRiskBorrow })}
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

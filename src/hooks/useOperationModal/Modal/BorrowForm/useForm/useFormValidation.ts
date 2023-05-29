import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset } from 'types';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  userBorrowLimitCents: number;
  limitTokens: string;
  formValues: FormValues;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError;
}

const useFormValidation = ({
  asset,
  userBorrowLimitCents,
  limitTokens,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const formError: FormError | undefined = useMemo(() => {
    if (userBorrowLimitCents === 0) {
      return 'NO_COLLATERALS';
    }

    if (
      asset.borrowCapTokens &&
      asset.borrowBalanceTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
    ) {
      return 'BORROW_CAP_ALREADY_REACHED';
    }

    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return 'INVALID_TOKEN_AMOUNT';
    }

    if (
      asset.borrowCapTokens &&
      asset.borrowBalanceTokens.plus(fromTokenAmountTokens).isGreaterThan(asset.borrowCapTokens)
    ) {
      return 'HIGHER_THAN_BORROW_CAP';
    }

    if (fromTokenAmountTokens.isGreaterThan(limitTokens)) {
      return 'HIGHER_THAN_BORROWABLE_AMOUNT';
    }
  }, [
    asset.vToken.underlyingToken,
    asset.borrowCapTokens,
    asset.userBorrowBalanceTokens,
    asset.borrowBalanceTokens,
    limitTokens,
    formValues.amountTokens,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;

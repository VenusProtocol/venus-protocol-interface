import type BigNumber from 'bignumber.js';
import type { TFunction } from 'i18next';
import type { TxFormError } from 'types';

export type CommonCasesErrorCode = 'EMPTY_TOKEN_AMOUNT' | 'HIGHER_THAN_AVAILABLE_AMOUNT';

export const validateCommonCases = ({
  amountTokens,
  limitTokens,
  t,
}: {
  amountTokens?: BigNumber;
  limitTokens: BigNumber;
  t: TFunction<'translation', undefined>;
}): TxFormError<CommonCasesErrorCode> | undefined => {
  if (!amountTokens || amountTokens.isLessThanOrEqualTo(0)) {
    return {
      code: 'EMPTY_TOKEN_AMOUNT',
    };
  }

  if (amountTokens.isGreaterThan(limitTokens)) {
    return {
      code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
      message: t('spokeForm.error.higherThanAvailableAmount'),
    };
  }
};

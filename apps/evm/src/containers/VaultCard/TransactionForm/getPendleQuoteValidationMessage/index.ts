import type { PendleSwapQuoteError } from 'clients/api';
import type { useTranslation } from 'libs/translations';

interface GetPendleQuoteValidationMessageInput {
  quoteError?: PendleSwapQuoteError;
  t: ReturnType<typeof useTranslation>['t'];
}

export const getPendleQuoteValidationMessage = ({
  quoteError,
  t,
}: GetPendleQuoteValidationMessageInput) => {
  if (quoteError?.code === 'PENDLE_NO_ROUTE_FOUND') {
    return t('vault.modals.error.noSwapQuoteFound');
  }

  if (quoteError?.code === 'PENDLE_AMOUNT_TOO_LOW') {
    return quoteError.data?.exception
      ? t('vault.modals.error.lowerThanMinimumAmount', {
          amount: quoteError.data.exception,
        })
      : t('vault.modals.error.amountTooLow');
  }

  if (quoteError?.code === 'PENDLE_INVALID_AMOUNT') {
    return t('vault.modals.error.invalidAmountFromQuote');
  }

  if (quoteError?.code === 'PENDLE_API_ERROR') {
    return t('vault.modals.error.pendleApiError');
  }

  return undefined;
};

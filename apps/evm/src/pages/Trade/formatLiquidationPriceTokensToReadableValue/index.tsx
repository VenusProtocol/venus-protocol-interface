import type { TFunction } from 'i18next';

import { type FormatTokensToReadableValueInput, formatTokensToReadableValue } from 'utilities';

export interface FormatLiquidationPriceTokensToReadableValueInput
  extends FormatTokensToReadableValueInput {
  t: TFunction<'translation', undefined>;
}

export const formatLiquidationPriceTokensToReadableValue = (
  _input: FormatLiquidationPriceTokensToReadableValueInput,
) => {
  const { t, ...input } = _input;

  if (input.value?.isLessThanOrEqualTo(0)) {
    return t('trade.operationForm.invalidLiquidationPrice');
  }

  return formatTokensToReadableValue({ ...input, addSymbol: false });
};

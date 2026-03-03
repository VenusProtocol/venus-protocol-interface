import type { Token } from 'types';

import type { FormValues } from '../useForm';

export const getInitialFormValues = (fromToken: Token): FormValues => ({
  amountTokens: '',
  fromToken,
  fixedRepayPercentage: undefined,
  acknowledgeHighPriceImpact: false,
});

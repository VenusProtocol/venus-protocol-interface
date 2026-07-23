import type BigNumber from 'bignumber.js';

import type {
  AssetBalanceMutation,
  LiquidityHub,
  LiquidityHubBalanceMutation,
  Pool,
  VhToken,
} from 'types';
import type { TxFormError } from 'types';
import type { FormErrorCode, FormValues } from '..';

interface UseFormValidationInput {
  vhToken: VhToken;
  formValues: FormValues;
  balanceMutations: Array<LiquidityHubBalanceMutation | AssetBalanceMutation>;
  liquidityHubs: LiquidityHub[];
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  isFromTokenApproved?: boolean;
  pool?: Pool;
  simulatedPool?: Pool;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: TxFormError<FormErrorCode>;
}

export const useFormValidation = (_input: UseFormValidationInput): UseFormValidationOutput => {
  // TODO: add validation logic
  const formError: TxFormError<FormErrorCode> | undefined = undefined;

  return {
    isFormValid: !formError,
    formError,
  };
};

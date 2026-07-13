import BigNumber from 'bignumber.js';

import { handleError } from 'libs/errors';
import type {
  AssetBalanceMutation,
  LiquidityHub,
  LiquidityHubBalanceMutation,
  Pool,
  VhToken,
} from 'types';

import type { TxFormError } from 'types';
import { useFormValidation } from './useFormValidation';

export interface FormValues {
  amountTokens: string;
  acknowledgeRisk: boolean;
}

export type FormErrorCode =
  | 'SUPPLY_CAP_ALREADY_REACHED'
  | 'HIGHER_THAN_AVAILABLE_AMOUNT'
  | 'REQUIRES_RISK_ACKNOWLEDGEMENT'
  | 'TOO_RISKY'
  | 'EMPTY_TOKEN_AMOUNT'
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_WALLET_SPENDING_LIMIT';

export const initialFormValues: FormValues = {
  amountTokens: '',
  acknowledgeRisk: false,
};

export interface UseFormInput {
  vhToken: VhToken;
  liquidityHubs: LiquidityHub[];
  balanceMutations: Array<AssetBalanceMutation | LiquidityHubBalanceMutation>;
  onSubmit: (formValues: FormValues) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  pool?: Pool;
  onSubmitSuccess?: () => void;
  simulatedPool?: Pool;
  isFromTokenApproved?: boolean;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  fromTokenUserWalletBalanceTokens?: BigNumber;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: TxFormError<FormErrorCode>;
}

export const useForm = ({
  vhToken,
  liquidityHubs,
  pool,
  simulatedPool,
  balanceMutations,
  fromTokenUserWalletBalanceTokens = new BigNumber(0),
  fromTokenWalletSpendingLimitTokens,
  isFromTokenApproved,
  formValues,
  setFormValues,
  onSubmit,
  onSubmitSuccess,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    vhToken,
    liquidityHubs,
    pool,
    simulatedPool,
    balanceMutations,
    formValues,
    isFromTokenApproved,
    fromTokenWalletSpendingLimitTokens,
    fromTokenUserWalletBalanceTokens,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      await onSubmit(formValues);

      // Reset form after successfully sending transaction
      setFormValues(() => initialFormValues);

      onSubmitSuccess?.();
    } catch (error) {
      handleError({ error });
    }
  };

  return {
    handleSubmit,
    isFormValid,
    formError,
  };
};

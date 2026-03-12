import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useCommonValidation } from 'hooks/useCommonValidation';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { FormValues } from 'pages/YieldPlus/OperationForm/PositionForm';
import type {
  FormError,
  PositionFormAction,
} from 'pages/YieldPlus/OperationForm/PositionForm/types';
import type { BalanceMutation, YieldPlusPosition } from 'types';

export const useFormValidation = ({
  balanceMutations,
  position,
  simulatedPosition,
  formValues,
  averageSwapPriceImpactPercentage,
  firstSwapQuoteErrorCode,
  limitShortTokens,
  action,
}: {
  position: YieldPlusPosition;
  balanceMutations: BalanceMutation[];
  formValues: FormValues;
  action?: PositionFormAction;
  limitShortTokens?: BigNumber;
  simulatedPosition?: YieldPlusPosition;
  averageSwapPriceImpactPercentage?: number;
  firstSwapQuoteErrorCode?: string;
}) => {
  const { accountAddress } = useAccountAddress();

  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const {
    isTokenApproved: isDsaTokenApproved,
    walletSpendingLimitTokens: userDsaWalletSpendingLimitTokens,
  } = useTokenApproval({
    token: formValues.dsaToken,
    spenderAddress: relativePositionManagerContractAddress,
    accountAddress,
  });

  const userDsaWalletBalanceTokens = position.dsaAsset.userWalletBalanceTokens;

  const { t } = useTranslation();

  const commonFormError = useCommonValidation({
    pool: position.pool,
    simulatedPool: simulatedPosition?.pool,
    balanceMutations,
    swapPriceImpactPercentage: averageSwapPriceImpactPercentage,
    swapQuoteErrorCode: firstSwapQuoteErrorCode,
    userAcknowledgesHighPriceImpact: formValues.acknowledgeHighPriceImpact,
    userAcknowledgesRisk: formValues.acknowledgeRisk,
  });

  const formError: FormError | undefined = useMemo(() => {
    if (commonFormError) {
      return commonFormError;
    }

    const dsaAmountTokens = formValues.dsaAmountTokens
      ? new BigNumber(formValues.dsaAmountTokens)
      : undefined;

    if (action === 'open' && (!dsaAmountTokens || dsaAmountTokens.isLessThanOrEqualTo(0))) {
      return {
        code: 'EMPTY_DSA_TOKEN_AMOUNT',
      };
    }

    if (dsaAmountTokens?.isGreaterThan(userDsaWalletBalanceTokens)) {
      return {
        code: 'HIGHER_THAN_WALLET_BALANCE',
        message: t('operationForm.error.higherThanWalletBalance', {
          tokenSymbol: position.dsaAsset.vToken.underlyingToken.symbol,
        }),
      };
    }

    if (
      userDsaWalletSpendingLimitTokens &&
      isDsaTokenApproved &&
      dsaAmountTokens?.isGreaterThan(userDsaWalletSpendingLimitTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('operationForm.error.higherThanWalletSpendingLimit'),
      };
    }

    const shortAmountTokens = formValues.shortAmountTokens
      ? new BigNumber(formValues.shortAmountTokens)
      : undefined;

    if (!shortAmountTokens || shortAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_SHORT_TOKEN_AMOUNT',
      };
    }

    if (limitShortTokens && shortAmountTokens?.isGreaterThan(limitShortTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE_SHORT_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      };
    }

    // TODO: add other cases
    if (!simulatedPosition || averageSwapPriceImpactPercentage === undefined) {
      return {
        code: 'MISSING_DATA',
      };
    }
  }, [
    userDsaWalletBalanceTokens,
    position.dsaAsset.vToken,
    formValues.dsaAmountTokens,
    formValues.shortAmountTokens,
    isDsaTokenApproved,
    t,
    userDsaWalletSpendingLimitTokens,
    commonFormError,
    averageSwapPriceImpactPercentage,
    simulatedPosition,
    limitShortTokens,
    action,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

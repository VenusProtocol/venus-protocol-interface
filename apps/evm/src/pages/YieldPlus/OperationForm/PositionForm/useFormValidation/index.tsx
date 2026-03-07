import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useCommonValidation } from 'hooks/useCommonValidation';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { FormValues } from 'pages/YieldPlus/OperationForm/PositionForm';
import type { FormError } from 'pages/YieldPlus/OperationForm/PositionForm/types';
import type { BalanceMutation, SwapQuote, YieldPlusPosition } from 'types';

export const useFormValidation = ({
  balanceMutations,
  position,
  simulatedPosition,
  formValues,
  swapQuoteErrorCode,
  swapQuote,
}: {
  position: YieldPlusPosition;
  balanceMutations: BalanceMutation[];
  formValues: FormValues;
  simulatedPosition?: YieldPlusPosition;
  swapQuoteErrorCode?: string;
  swapQuote?: SwapQuote;
}) => {
  const { accountAddress } = useAccountAddress();

  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const {
    isTokenApproved: isDsaTokenApproved,
    walletSpendingLimitTokens: userDsaWalletSpendingLimitTokens,
  } = useTokenApproval({
    token: position.dsaAsset.vToken.underlyingToken,
    spenderAddress: relativePositionManagerContractAddress,
    accountAddress,
  });

  const userDsaWalletBalanceTokens = position.dsaAsset.userWalletBalanceTokens;

  const { t } = useTranslation();

  const commonFormError = useCommonValidation({
    pool: position.pool,
    simulatedPool: simulatedPosition?.pool,
    swapQuote,
    balanceMutations,
    swapQuoteErrorCode,
    userAcknowledgesHighPriceImpact: formValues.acknowledgeHighPriceImpact,
  });

  const formError: FormError | undefined = useMemo(() => {
    if (commonFormError) {
      return commonFormError;
    }

    const dsaAmountTokens = formValues.dsaAmountTokens
      ? new BigNumber(formValues.dsaAmountTokens)
      : undefined;

    if (!dsaAmountTokens || dsaAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_DSA_TOKEN_AMOUNT',
      };
    }

    if (dsaAmountTokens.isGreaterThan(userDsaWalletBalanceTokens)) {
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
      dsaAmountTokens.isGreaterThan(userDsaWalletSpendingLimitTokens)
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

    // TODO: add other cases
  }, [
    userDsaWalletBalanceTokens,
    position.dsaAsset.vToken,
    formValues.dsaAmountTokens,
    formValues.shortAmountTokens,
    isDsaTokenApproved,
    t,
    userDsaWalletSpendingLimitTokens,
    commonFormError,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

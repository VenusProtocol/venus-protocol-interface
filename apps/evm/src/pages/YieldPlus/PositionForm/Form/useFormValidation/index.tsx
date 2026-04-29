import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useCommonValidation } from 'hooks/useCommonValidation';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import useTokenApproval from 'hooks/useTokenApproval';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { FormValues } from 'pages/YieldPlus/PositionForm';
import type { FormError, PositionFormAction } from 'pages/YieldPlus/PositionForm';
import type { BalanceMutation, YieldPlusPosition } from 'types';

export const useFormValidation = ({
  balanceMutations,
  position,
  simulatedPosition,
  formValues,
  averageSwapPriceImpactPercentage,
  swapQuoteError,
  limitShortTokens,
  limitDsaTokens,
  action,
}: {
  position: YieldPlusPosition;
  balanceMutations: BalanceMutation[];
  formValues: FormValues;
  action?: PositionFormAction;
  limitShortTokens?: BigNumber;
  limitDsaTokens?: BigNumber;
  simulatedPosition?: YieldPlusPosition;
  averageSwapPriceImpactPercentage?: number;
  swapQuoteError?: Error;
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
    swapQuoteErrorCode: swapQuoteError?.message,
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

    const longAmountTokens = formValues.longAmountTokens
      ? new BigNumber(formValues.longAmountTokens)
      : undefined;

    const shortAmountTokens = formValues.shortAmountTokens
      ? new BigNumber(formValues.shortAmountTokens)
      : undefined;

    const isClosingEmptyPosition =
      action === 'close' && !shortAmountTokens?.toNumber() && !longAmountTokens?.toNumber();

    const isClosingPositionWithEmptyShortBalance =
      action === 'close' &&
      position.shortBalanceTokens.isZero() &&
      !!longAmountTokens?.isGreaterThan(0);

    if (
      (action === 'open' || action === 'supplyDsa' || action === 'withdrawDsa') &&
      (!dsaAmountTokens || dsaAmountTokens.isLessThanOrEqualTo(0))
    ) {
      return {
        code: 'EMPTY_DSA_TOKEN_AMOUNT',
      };
    }

    if (action !== 'withdrawDsa' && dsaAmountTokens?.isGreaterThan(userDsaWalletBalanceTokens)) {
      return {
        code: 'HIGHER_THAN_WALLET_BALANCE',
        message: t('operationForm.error.higherThanWalletBalance', {
          tokenSymbol: position.dsaAsset.vToken.underlyingToken.symbol,
        }),
      };
    }

    if (
      action !== 'withdrawDsa' &&
      userDsaWalletSpendingLimitTokens &&
      isDsaTokenApproved &&
      dsaAmountTokens?.isGreaterThan(userDsaWalletSpendingLimitTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('operationForm.error.higherThanWalletSpendingLimit'),
      };
    }

    if (
      action !== 'supplyDsa' &&
      action !== 'withdrawDsa' &&
      !isClosingPositionWithEmptyShortBalance &&
      !isClosingEmptyPosition &&
      (!shortAmountTokens || shortAmountTokens.isLessThanOrEqualTo(0))
    ) {
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

    if (limitDsaTokens && dsaAmountTokens?.isGreaterThan(limitDsaTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE_DSA_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      };
    }

    const isUsingSwap = action !== 'supplyDsa' && action !== 'withdrawDsa';
    const isMissingSwapPriceImpact = isUsingSwap && averageSwapPriceImpactPercentage === undefined;
    const isMissingSimulationData = !simulatedPosition || isMissingSwapPriceImpact;

    if (!isClosingEmptyPosition && isMissingSimulationData) {
      return {
        code: 'MISSING_DATA',
      };
    }
  }, [
    userDsaWalletBalanceTokens,
    position.dsaAsset.vToken,
    formValues.dsaAmountTokens,
    formValues.shortAmountTokens,
    formValues.longAmountTokens,
    position.shortBalanceTokens,
    isDsaTokenApproved,
    t,
    userDsaWalletSpendingLimitTokens,
    commonFormError,
    averageSwapPriceImpactPercentage,
    simulatedPosition,
    limitShortTokens,
    limitDsaTokens,
    action,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

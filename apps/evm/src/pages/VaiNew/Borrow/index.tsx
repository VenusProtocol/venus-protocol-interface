import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  useGetLegacyPool,
  useGetMintableVai,
  useGetPrimeToken,
  useGetTokenUsdPrice,
  useGetVaiRepayApy,
  useGetVaiTreasuryPercentage,
  useMintVai,
} from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  NoticeError,
  NoticeWarning,
  RhfSubmitButton,
  RhfTokenTextField,
  Spinner,
} from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { PRIME_DOC_URL } from 'constants/prime';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { Link } from 'containers/Link';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { displayMutationError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import {
  convertDollarsToCents,
  convertTokensToMantissa,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { AccountVaiData } from '../AccountVaiData';
import { FormValues } from '../types';
import TEST_IDS from './testIds';
import { ErrorCode, useForm } from './useForm';

export const Borrow: React.FC = () => {
  const { t, Trans } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const vai = useGetToken({
    symbol: 'VAI',
  })!;

  const { data: getLegacyPoolData } = useGetLegacyPool({
    accountAddress,
  });
  const legacyPool = getLegacyPoolData?.pool;

  const { data: getVaiUsdPrice } = useGetTokenUsdPrice({
    token: vai,
  });
  const vaiPriceDollars = getVaiUsdPrice?.tokenPriceUsd;

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const isUserPrime = !!getPrimeTokenData?.exists;
  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const isUserMissingPrimeToken = isUserConnected && isPrimeEnabled && !isUserPrime;

  const { mutateAsync: mintVai } = useMintVai();

  const { data: vaiTreasuryData } = useGetVaiTreasuryPercentage();
  const feePercentage = vaiTreasuryData?.percentage;

  const { data: getVaiRepayApyData } = useGetVaiRepayApy();

  const readableBorrowApy = useFormatPercentageToReadableValue({
    value: getVaiRepayApyData?.repayApyPercentage,
  });

  const { data: mintableVaiData, isLoading: isGetMintableVaiLoading } = useGetMintableVai(
    {
      accountAddress: accountAddress || '',
      vai: vai!,
    },
    {
      enabled: !!accountAddress && !!vai,
    },
  );
  const borrowableAmountMantissa = useMemo(
    () =>
      BigNumber.min(
        mintableVaiData?.vaiLiquidityMantissa || 0,
        mintableVaiData?.accountMintableVaiMantissa || 0,
      ),
    [mintableVaiData?.vaiLiquidityMantissa, mintableVaiData?.accountMintableVaiMantissa],
  );

  const { control, handleSubmit, watch, formState, setValue } = useForm({
    ...mintableVaiData,
  });

  const inputAmountTokens = watch('amountTokens');

  const feeTokens = useMemo(
    () =>
      feePercentage &&
      new BigNumber(inputAmountTokens || 0).multipliedBy(feePercentage).dividedBy(100),
    [feePercentage, inputAmountTokens],
  );

  const readableFee = useMemo(() => {
    if (!feePercentage || !feeTokens) {
      return PLACEHOLDER_KEY;
    }

    const readableFeeVai = formatTokensToReadableValue({
      value: feeTokens,
      token: vai,
    });

    const readableFeePercentage = formatPercentageToReadableValue(feePercentage);

    return `${readableFeeVai} (${readableFeePercentage})`;
  }, [feePercentage, feeTokens, vai]);

  const readableBorrowableAmount = useConvertMantissaToReadableTokenString({
    value: borrowableAmountMantissa,
    token: vai,
  });

  // Calculate maximum and safe maximum amount of tokens user can borrow
  const safeLimitTokens = useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been
    // reached
    if (
      !vaiPriceDollars ||
      !legacyPool ||
      legacyPool.userBorrowBalanceCents === undefined ||
      !legacyPool.userBorrowLimitCents ||
      legacyPool.userBorrowBalanceCents.isGreaterThanOrEqualTo(legacyPool.userBorrowLimitCents)
    ) {
      return '0';
    }

    const safeBorrowLimitCents = legacyPool.userBorrowLimitCents
      .multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE)
      .dividedBy(100);
    const marginWithSafeBorrowLimitCents = safeBorrowLimitCents.minus(
      legacyPool.userBorrowBalanceCents,
    );

    const vaiPriceCents = convertDollarsToCents(vaiPriceDollars);
    const safeMaxTokens = legacyPool.userBorrowBalanceCents.isLessThan(safeBorrowLimitCents)
      ? // Convert dollars to tokens
        new BigNumber(marginWithSafeBorrowLimitCents).dividedBy(vaiPriceCents)
      : new BigNumber(0);

    return safeMaxTokens.dp(vai.decimals, BigNumber.ROUND_DOWN).toFixed();
  }, [vai, vaiPriceDollars, legacyPool]);

  const isDangerousTransaction = useMemo(
    () => new BigNumber(inputAmountTokens).isGreaterThanOrEqualTo(safeLimitTokens),
    [inputAmountTokens, safeLimitTokens],
  );

  const errorMessage = useMemo(() => {
    const errorCode = formState.errors.amountTokens?.message;

    if (errorCode === ErrorCode.HIGHER_THAN_LIQUIDITY) {
      return t('vai.borrow.notice.amountHigherThanLiquidity');
    }

    if (errorCode === ErrorCode.HIGHER_THAN_MINTABLE_AMOUNT) {
      return t('vai.borrow.notice.amountHigherThanAccountMintableAmount');
    }

    return undefined;
  }, [t, formState.errors.amountTokens]);

  const submitButtonEnabledLabel = useMemo(() => {
    if (isDangerousTransaction) {
      return t('vai.borrow.submitButton.borrowAtHighRiskLabel');
    }

    return t('vai.borrow.submitButton.borrowLabel');
  }, [t, isDangerousTransaction]);

  const onSubmit: SubmitHandler<FormValues> = async ({ amountTokens }) => {
    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(amountTokens),
      token: vai,
    });

    try {
      await mintVai({ amountMantissa });
    } catch (error) {
      displayMutationError({ error });
    }
  };

  const isInitialLoading = isGetMintableVaiLoading || isGetPrimeTokenLoading;

  if (isInitialLoading) {
    return <Spinner />;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {isUserMissingPrimeToken && (
        <NoticeWarning
          data-testid={TEST_IDS.primeOnlyWarning}
          description={
            <Trans
              i18nKey="vai.borrow.primeOnlyWarning"
              components={{
                WhiteText: <span className="text-offWhite" />,
                Link: <Link href={PRIME_DOC_URL} />,
              }}
            />
          }
        />
      )}

      <div className="space-y-3">
        <RhfTokenTextField<FormValues>
          control={control}
          name="amountTokens"
          rules={{ required: true }}
          disabled={!isUserConnected || isUserMissingPrimeToken}
          token={vai}
          rightMaxButton={{
            label: t('vai.borrow.amountTokensInput.limitButtonLabel'),
            onClick: () =>
              setValue('amountTokens', safeLimitTokens, {
                shouldValidate: true,
                shouldTouch: true,
                shouldDirty: true,
              }),
          }}
        />

        {errorMessage && <NoticeError description={errorMessage} />}

        {!errorMessage && isDangerousTransaction && (
          <NoticeWarning description={t('vai.borrow.notice.riskOfLiquidation')} />
        )}
      </div>

      <div className="space-y-3">
        <LabeledInlineContent
          label={t('vai.borrow.borrowableAmount.label')}
          tooltip={t('vai.borrow.borrowableAmount.tooltip')}
        >
          {readableBorrowableAmount}
        </LabeledInlineContent>

        <LabeledInlineContent
          iconSrc="fee"
          iconClassName="text-lightGrey"
          label={t('vai.borrow.borrowApy.label')}
          tooltip={t('vai.borrow.borrowApy.tooltip')}
        >
          {readableBorrowApy}
        </LabeledInlineContent>

        {feeTokens?.isGreaterThan(0) && (
          <LabeledInlineContent
            iconSrc="fee"
            iconClassName="text-lightGrey"
            label={t('vai.borrow.fee.label')}
          >
            {readableFee}
          </LabeledInlineContent>
        )}
      </div>

      {isUserConnected && (
        <>
          <Delimiter />

          <AccountVaiData amountTokens={inputAmountTokens} action="borrow" />
        </>
      )}

      <RhfSubmitButton
        requiresConnectedWallet
        control={control}
        isDangerousSubmission={isDangerousTransaction}
        enabledLabel={submitButtonEnabledLabel}
        disabledLabel={t('vai.borrow.submitButton.enterValidAmountLabel')}
      />
    </form>
  );
};

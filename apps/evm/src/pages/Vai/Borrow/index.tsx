import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, type SubmitHandler } from 'react-hook-form';

import {
  useGetMintableVai,
  useGetPool,
  useGetPrimeToken,
  useGetTokenUsdPrice,
  useGetVaiRepayApr,
  useGetVaiTreasuryPercentage,
  useMintVai,
} from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  NoticeError,
  NoticeWarning,
  RiskAcknowledgementToggle,
  Spinner,
} from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { PRIME_DOC_URL } from 'constants/prime';
import { Link } from 'containers/Link';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { handleError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import {
  calculateHealthFactor,
  convertDollarsToCents,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import {
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_MAX_THRESHOLD,
} from 'constants/healthFactor';
import { RhfSubmitButton, RhfTokenTextField } from 'containers/Form';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { AccountVaiData } from '../AccountVaiData';
import TEST_IDS from './testIds';
import type { FormValues } from './types';
import { ErrorCode, useForm } from './useForm';

export const Borrow: React.FC = () => {
  const { t, Trans } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;
  const { corePoolComptrollerContractAddress } = useGetChainMetadata();

  const vai = useGetToken({
    symbol: 'VAI',
  })!;

  const { data: getLegacyPoolData } = useGetPool({
    accountAddress,
    poolComptrollerAddress: corePoolComptrollerContractAddress || NULL_ADDRESS,
  });
  const legacyPool = getLegacyPoolData?.pool;

  const { data: getVaiUsdPrice } = useGetTokenUsdPrice({
    token: vai,
  });
  const vaiPriceCents = getVaiUsdPrice?.tokenPriceUsd
    ? convertDollarsToCents(getVaiUsdPrice.tokenPriceUsd)
    : undefined;

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

  const { data: getVaiRepayAprData } = useGetVaiRepayApr();

  const readableBorrowApr = useFormatPercentageToReadableValue({
    value: getVaiRepayAprData?.repayAprPercentage,
  });

  const { data: mintableVaiData, isLoading: isGetMintableVaiLoading } = useGetMintableVai(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled: !!accountAddress,
    },
  );

  const [limitTokens, safeLimitTokens] = useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been reached
    if (
      !vaiPriceCents ||
      !legacyPool ||
      legacyPool.userBorrowBalanceCents === undefined ||
      !legacyPool.userBorrowLimitCents ||
      legacyPool.userBorrowBalanceCents.isGreaterThanOrEqualTo(legacyPool.userBorrowLimitCents)
    ) {
      return [new BigNumber(0), new BigNumber(0)];
    }

    let marginWithUserSafeBorrowLimitTokens = legacyPool.userBorrowLimitCents
      .div(HEALTH_FACTOR_SAFE_MAX_THRESHOLD)
      .minus(legacyPool.userBorrowBalanceCents)
      // Convert to tokens
      .dividedBy(vaiPriceCents);

    if (marginWithUserSafeBorrowLimitTokens.isLessThan(0)) {
      marginWithUserSafeBorrowLimitTokens = new BigNumber(0);
    }

    const maxTokens = convertMantissaToTokens({
      value: BigNumber.min(
        // Mintable limit
        mintableVaiData?.accountMintableVaiMantissa || new BigNumber(0),
        // Liquidities limit
        mintableVaiData?.vaiLiquidityMantissa || new BigNumber(0),
      ),
      token: vai,
    });

    const safeMaxTokens = BigNumber.min(maxTokens, marginWithUserSafeBorrowLimitTokens).dp(
      vai.decimals,
    );

    return [maxTokens, safeMaxTokens];
  }, [vaiPriceCents, legacyPool, mintableVaiData, mintableVaiData, vai]);

  const {
    form: { control, handleSubmit, watch, formState, setValue, reset, trigger },
  } = useForm({
    ...mintableVaiData,
    vaiPriceCents,
    userBorrowBalanceCents: legacyPool?.userBorrowBalanceCents,
    userLiquidationThresholdCents: legacyPool?.userLiquidationThresholdCents,
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

  const readableLimit = useFormatTokensToReadableValue({
    value: limitTokens,
    token: vai,
  });

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

  const hypotheticalHealthFactor = useMemo(() => {
    if (
      !Number(inputAmountTokens) ||
      !vaiPriceCents ||
      !legacyPool?.userLiquidationThresholdCents ||
      !legacyPool?.userBorrowBalanceCents
    ) {
      return undefined;
    }

    const amountCents = new BigNumber(inputAmountTokens).multipliedBy(vaiPriceCents);

    return calculateHealthFactor({
      borrowBalanceCents: legacyPool.userBorrowBalanceCents.plus(amountCents).toNumber(),
      liquidationThresholdCents: legacyPool.userLiquidationThresholdCents.toNumber(),
    });
  }, [legacyPool, vaiPriceCents, inputAmountTokens]);

  const isRiskyOperation = useMemo(
    () =>
      hypotheticalHealthFactor !== undefined &&
      hypotheticalHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
      !formState.errors.amountTokens,
    [hypotheticalHealthFactor, formState.errors.amountTokens],
  );

  // Trigger revalidation of acknowledgeRisk field when it is rendered or removed. This is a
  // workaround to make sure React Hook Form initializes the field correctly
  useEffect(() => {
    if (isRiskyOperation) {
      trigger('acknowledgeRisk');
    }
  }, [trigger, isRiskyOperation]);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setValue('amountTokens', '', {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
    }
  }, [accountAddress, setValue]);

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async ({ amountTokens }) => {
      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(amountTokens),
        token: vai,
      });

      try {
        await mintVai({ amountMantissa });

        // Reset form on successful submission
        reset();
      } catch (error) {
        handleError({ error });
      }
    },
    [mintVai, reset, vai],
  );

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
              setValue('amountTokens', safeLimitTokens.toFixed(), {
                shouldValidate: true,
                shouldTouch: true,
                shouldDirty: true,
              }),
          }}
        />

        {errorMessage && <NoticeError description={errorMessage} />}
      </div>

      <div className="space-y-3">
        <LabeledInlineContent
          label={t('vai.borrow.availableAmount.label')}
          tooltip={t('vai.borrow.availableAmount.tooltip')}
        >
          {readableLimit}
        </LabeledInlineContent>

        <LabeledInlineContent
          iconSrc={vai}
          label={t('vai.borrow.borrowApr.label')}
          tooltip={t('vai.borrow.borrowApr.tooltip')}
        >
          {readableBorrowApr}
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

      {isRiskyOperation && (
        <Controller
          name="acknowledgeRisk"
          control={control}
          render={({ field }) => <RiskAcknowledgementToggle {...field} />}
        />
      )}

      <RhfSubmitButton
        requiresConnectedWallet
        analyticVariant="vai_borrow_form"
        control={control}
        enabledLabel={t('vai.borrow.submitButton.borrowLabel')}
        disabledLabel={
          // Only show disabled label when error concerns the amount entered
          formState.errors.acknowledgeRisk
            ? t('vai.borrow.submitButton.borrowLabel')
            : t('vai.borrow.submitButton.enterValidAmountLabel')
        }
      />
    </form>
  );
};

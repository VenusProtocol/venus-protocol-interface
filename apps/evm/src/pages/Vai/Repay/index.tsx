import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo } from 'react';
import { type SubmitHandler, useFormState, useWatch } from 'react-hook-form';

import { useGetBalanceOf, useGetPool, useRepayVai } from 'clients/api';
import { Delimiter, LabeledInlineContent, NoticeWarning, SpendingLimit, Spinner } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import MAX_UINT256 from 'constants/maxUint256';
import { AccountPoolDailyEarnings } from 'containers/AccountPoolDailyEarnings';
import { AccountPoolHealth } from 'containers/AccountPoolHealth';
import { RhfSubmitButton, RhfTokenTextField } from 'containers/Form';
import { useChain } from 'hooks/useChain';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { handleError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { BalanceMutation } from 'types';
import { convertMantissaToTokens } from 'utilities/convertMantissaToTokens';
import { convertTokensToMantissa } from 'utilities/convertTokensToMantissa';
import formatPercentageToReadableValue from 'utilities/formatPercentageToReadableValue';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import { shouldShowAccountHealth } from 'utilities/shouldShowAccountHealth';
import TEST_IDS from './testIds';
import type { FormValues } from './types';
import { useForm } from './useForm';

const userVaiBalanceRefetchInterval = generatePseudoRandomRefetchInterval();

export const Repay: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;
  const chain = useChain();

  const vai = useGetToken({
    symbol: 'VAI',
  })!;

  const { address: vaiControllerContractAddress } = useGetContractAddress({
    name: 'VaiController',
  });

  const {
    walletSpendingLimitTokens: userWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeVaiWalletSpendingLimit,
    isWalletSpendingLimitLoading: isVaiWalletSpendingLimitLoading,
    isRevokeWalletSpendingLimitLoading: isRevokeVaiWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: vai,
    spenderAddress: vaiControllerContractAddress,
    accountAddress,
  });

  const { data: userVaiBalanceData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: vai,
    },
    {
      enabled: !!accountAddress,
      refetchInterval: userVaiBalanceRefetchInterval,
    },
  );
  const userVaiWalletBalanceMantissa = userVaiBalanceData?.balanceMantissa;
  const userVaiWalletBalanceTokens = useMemo(
    () =>
      userVaiWalletBalanceMantissa &&
      convertMantissaToTokens({
        value: userVaiWalletBalanceMantissa,
        token: vai,
      }),
    [userVaiWalletBalanceMantissa, vai],
  );

  const readableUserVaiWalletBalance = useConvertMantissaToReadableTokenString({
    value: userVaiWalletBalanceMantissa,
    token: vai,
  });

  const { mutateAsync: repayVai } = useRepayVai();

  const { data: getPoolData, isLoading: isGetPoolDataLoading } = useGetPool({
    poolComptrollerAddress: chain.corePoolComptrollerContractAddress,
    accountAddress,
  });
  const legacyPool = getPoolData?.pool;
  const userVaiBorrowBalanceTokens = legacyPool?.vai?.userBorrowBalanceTokens;

  const readableBorrowApr = formatPercentageToReadableValue(legacyPool?.vai?.borrowAprPercentage);

  const {
    limitTokens,
    form: { control, handleSubmit, setValue, reset },
  } = useForm({
    userVaiWalletBalanceMantissa,
    userVaiBorrowBalanceTokens,
    userWalletSpendingLimitTokens,
  });
  const { errors } = useFormState({ control });

  const inputValue = useWatch({ control, name: 'amountTokens' });
  const _debouncedInputAmountTokens = useDebounceValue(inputValue);
  const debouncedInputAmountTokens = new BigNumber(_debouncedInputAmountTokens || 0);

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'vai',
      amountTokens: debouncedInputAmountTokens,
      action: 'repay',
    },
  ];

  const { data: getSimulatedPoolData } = useSimulatePoolMutations({
    pool: legacyPool,
    balanceMutations,
  });
  const simulatedPool = getSimulatedPoolData?.pool;

  const isRepayingFullLoan = !!userVaiBorrowBalanceTokens?.isEqualTo(debouncedInputAmountTokens);

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
      if (!userVaiBorrowBalanceTokens) {
        return;
      }

      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(amountTokens),
        token: vai,
      });

      try {
        await repayVai({
          amountMantissa: isRepayingFullLoan ? MAX_UINT256 : amountMantissa,
        });

        // Reset form on successful submission
        reset();
      } catch (error) {
        handleError({ error });
      }
    },
    [repayVai, reset, vai, userVaiBorrowBalanceTokens, isRepayingFullLoan],
  );

  const isInitialLoading = isGetPoolDataLoading;

  if (isInitialLoading) {
    return <Spinner />;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        <RhfTokenTextField<FormValues>
          control={control}
          name="amountTokens"
          rules={{ required: true }}
          disabled={!isUserConnected}
          token={vai}
          rightMaxButton={
            limitTokens
              ? {
                  label: t('vai.repay.amountTokensInput.limitButtonLabel'),
                  onClick: () =>
                    setValue('amountTokens', limitTokens.toFixed(), {
                      shouldValidate: true,
                      shouldTouch: true,
                      shouldDirty: true,
                    }),
                }
              : undefined
          }
        />

        {!errors.amountTokens && isRepayingFullLoan && (
          <NoticeWarning description={t('vai.repay.notice.fullRepaymentWarning')} />
        )}
      </div>

      <div className="space-y-3">
        <LabeledInlineContent
          label={t('vai.repay.walletBalance.label')}
          data-testid={TEST_IDS.userVaiWalletBalance}
        >
          {readableUserVaiWalletBalance}
        </LabeledInlineContent>

        <SpendingLimit
          token={vai}
          walletBalanceTokens={userVaiWalletBalanceTokens}
          walletSpendingLimitTokens={userWalletSpendingLimitTokens}
          onRevoke={revokeVaiWalletSpendingLimit}
          isRevokeLoading={isRevokeVaiWalletSpendingLimitLoading}
        />

        <LabeledInlineContent
          iconSrc={vai}
          label={t('vai.repay.borrowApr.label')}
          tooltip={t('vai.repay.borrowApr.tooltip')}
          data-testid={TEST_IDS.borrowApr}
        >
          {readableBorrowApr}
        </LabeledInlineContent>
      </div>

      {isUserConnected && legacyPool && (
        <>
          <Delimiter />

          {shouldShowAccountHealth({ pool: legacyPool, simulatedPool }) && (
            <AccountPoolHealth pool={legacyPool} simulatedPool={simulatedPool} />
          )}

          <AccountPoolDailyEarnings pool={legacyPool} simulatedPool={simulatedPool} />
        </>
      )}

      <RhfSubmitButton
        analyticVariant="vai_repay_form"
        requiresConnectedWallet
        spendingApproval={
          vaiControllerContractAddress && {
            token: vai,
            spenderAddress: vaiControllerContractAddress,
          }
        }
        control={control}
        disabled={isVaiWalletSpendingLimitLoading || isRevokeVaiWalletSpendingLimitLoading}
        enabledLabel={t('vai.repay.submitButton.repayLabel')}
        disabledLabel={t('vai.repay.submitButton.enterValidAmountLabel')}
      />
    </form>
  );
};

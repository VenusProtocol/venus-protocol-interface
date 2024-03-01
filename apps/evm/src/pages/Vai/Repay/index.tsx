import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { SubmitHandler } from 'react-hook-form';

import {
  useGetBalanceOf,
  useGetVaiRepayAmountWithInterests,
  useGetVaiRepayApr,
  useRepayVai,
} from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  NoticeError,
  NoticeWarning,
  RhfSubmitButton,
  RhfTokenTextField,
  SpendingLimit,
  Spinner,
} from 'components';
import MAX_UINT256 from 'constants/maxUint256';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useTokenApproval from 'hooks/useTokenApproval';
import { useGetVaiControllerContractAddress } from 'libs/contracts';
import { displayMutationError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  generatePseudoRandomRefetchInterval,
} from 'utilities';

import { AccountVaiData } from '../AccountVaiData';
import { FormValues } from '../types';
import TEST_IDS from './testIds';
import { ErrorCode, useForm } from './useForm';

const userVaiBalanceRefetchInterval = generatePseudoRandomRefetchInterval();

export const Repay: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const vai = useGetToken({
    symbol: 'VAI',
  })!;

  const vaiControllerContractAddress = useGetVaiControllerContractAddress();

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
      accountAddress: accountAddress || '',
      token: vai!,
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

  const { data: getVaiRepayAprData } = useGetVaiRepayApr();

  const readableBorrowApr = useFormatPercentageToReadableValue({
    value: getVaiRepayAprData?.repayAprPercentage,
  });

  const { data: userVaiBorrowBalanceData, isLoading: isGetUserVaiBorrowBalanceLoading } =
    useGetVaiRepayAmountWithInterests(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const userVaiBorrowBalanceMantissa =
    userVaiBorrowBalanceData?.vaiRepayAmountWithInterestsMantissa;

  const readableUserVaiBorrowBalance = useConvertMantissaToReadableTokenString({
    value: userVaiBorrowBalanceMantissa,
    token: vai,
  });

  const {
    limitTokens,
    form: { control, handleSubmit, watch, formState, setValue, reset },
  } = useForm({
    userVaiWalletBalanceMantissa,
    userVaiBorrowBalanceMantissa,
    userWalletSpendingLimitTokens,
  });

  const inputAmountTokens = watch('amountTokens');

  const isRepayingFullLoan = useMemo(() => {
    if (!userVaiBorrowBalanceMantissa) {
      return false;
    }

    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(inputAmountTokens),
      token: vai,
    });

    return amountMantissa.isEqualTo(userVaiBorrowBalanceMantissa);
  }, [inputAmountTokens, userVaiBorrowBalanceMantissa, vai]);

  const errorMessage = useMemo(() => {
    const errorCode = formState.errors.amountTokens?.message;

    if (errorCode === ErrorCode.HIGHER_THAN_WALLET_BALANCE) {
      return t('vai.repay.notice.amountHigherThanWalletBalance', {
        tokenSymbol: vai.symbol,
      });
    }

    if (errorCode === ErrorCode.HIGHER_THAN_WALLET_SPENDING_LIMIT) {
      return t('vai.repay.notice.amountHigherThanWalletSpendingLimit');
    }

    if (errorCode === ErrorCode.HIGHER_THAN_BORROW_BALANCE) {
      return t('vai.repay.notice.amountHigherThanBorrowBalance');
    }

    return undefined;
  }, [t, formState.errors.amountTokens, vai]);

  const onSubmit: SubmitHandler<FormValues> = useCallback(
    async ({ amountTokens }) => {
      if (!userVaiBorrowBalanceMantissa) {
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
        displayMutationError({ error });
      }
    },
    [repayVai, reset, vai, userVaiBorrowBalanceMantissa, isRepayingFullLoan],
  );

  const isInitialLoading = isGetUserVaiBorrowBalanceLoading;

  if (isInitialLoading) {
    return <Spinner />;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <LabeledInlineContent
        label={t('vai.repay.borrowBalance')}
        data-testid={TEST_IDS.userVaiBorrowBalance}
      >
        {readableUserVaiBorrowBalance}
      </LabeledInlineContent>

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

        {errorMessage && <NoticeError description={errorMessage} />}

        {!errorMessage && isRepayingFullLoan && (
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

      {isUserConnected && (
        <>
          <Delimiter />

          <AccountVaiData amountTokens={inputAmountTokens} action="repay" />
        </>
      )}

      <RhfSubmitButton
        requiresConnectedWallet
        spendingApproval={
          vaiControllerContractAddress && {
            token: vai,
            spenderAddress: vaiControllerContractAddress,
            hideSpendingApprovalStep: !formState.isValid,
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

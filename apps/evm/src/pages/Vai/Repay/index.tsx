import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import { useGetBalanceOf, useGetPool, useGetVaiRepayApr, useRepayVai } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  NoticeError,
  NoticeWarning,
  SpendingLimit,
  Spinner,
} from 'components';
import MAX_UINT256 from 'constants/maxUint256';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useTokenApproval from 'hooks/useTokenApproval';
import { handleError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatPercentageToReadableValue,
  generatePseudoRandomRefetchInterval,
} from 'utilities';

import { NULL_ADDRESS } from 'constants/address';
import { RhfSubmitButton, RhfTokenTextField } from 'containers/Form';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { AccountVaiData } from '../AccountVaiData';
import TEST_IDS from './testIds';
import type { FormValues } from './types';
import { ErrorCode, useForm } from './useForm';

const userVaiBalanceRefetchInterval = generatePseudoRandomRefetchInterval();

export const Repay: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  const chainMetadata = useGetChainMetadata();

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

  const { data: getVaiRepayAprData } = useGetVaiRepayApr();

  const readableBorrowApr = formatPercentageToReadableValue(getVaiRepayAprData?.repayAprPercentage);

  const { data: getPoolData, isLoading: isGetPoolDataLoading } = useGetPool({
    poolComptrollerAddress: chainMetadata.corePoolComptrollerContractAddress,
    accountAddress,
  });

  const userVaiBorrowBalanceTokens = getPoolData?.pool.userVaiBorrowBalanceTokens;

  const {
    limitTokens,
    form: { control, handleSubmit, watch, formState, setValue, reset },
  } = useForm({
    userVaiWalletBalanceMantissa,
    userVaiBorrowBalanceTokens,
    userWalletSpendingLimitTokens,
  });

  const inputAmountTokens = watch('amountTokens');

  const isRepayingFullLoan = !!userVaiBorrowBalanceTokens?.isEqualTo(inputAmountTokens);

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

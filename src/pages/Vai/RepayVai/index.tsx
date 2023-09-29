/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ApproveTokenSteps,
  ApproveTokenStepsProps,
  ConnectWallet,
  Delimiter,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  NoticeWarning,
  SpendingLimit,
  Spinner,
} from 'components';
import { ContractReceipt } from 'ethers';
import { useGetVaiControllerContractAddress } from 'packages/contractsNew';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import {
  convertTokensToWei,
  convertWeiToTokens,
  generatePseudoRandomRefetchInterval,
} from 'utilities';

import { useGetBalanceOf, useGetVaiRepayAmountWithInterests, useRepayVai } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import { AmountForm, AmountFormProps } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useGetToken from 'hooks/useGetToken';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import useTokenApproval from 'hooks/useTokenApproval';

import { useStyles } from '../styles';
import TEST_IDS from '../testIds';
import RepayFee from './RepayFee';

export interface IRepayVaiUiProps {
  disabled: boolean;
  isInitialLoading: boolean;
  isSubmitting: boolean;
  repayVai: ({
    amountWei,
    isRepayingFullLoan,
  }: {
    amountWei: BigNumber;
    isRepayingFullLoan: boolean;
  }) => Promise<ContractReceipt | undefined>;
  isVaiApproved: ApproveTokenStepsProps['isTokenApproved'];
  approveVai: ApproveTokenStepsProps['approveToken'];
  isApproveVaiLoading: ApproveTokenStepsProps['isApproveTokenLoading'];
  isVaiApprovalStatusLoading: ApproveTokenStepsProps['isWalletSpendingLimitLoading'];
  isRevokeVaiWalletSpendingLimitLoading: boolean;
  revokeVaiWalletSpendingLimit: () => Promise<unknown>;
  vai: Token;
  vaiWalletSpendingLimitTokens?: BigNumber;
  userBalanceWei?: BigNumber;
  repayBalanceWei?: BigNumber;
}

const userVaiRefetchInterval = generatePseudoRandomRefetchInterval();

export const RepayVaiUi: React.FC<IRepayVaiUiProps> = ({
  disabled,
  userBalanceWei,
  repayBalanceWei,
  isVaiApproved,
  approveVai,
  isApproveVaiLoading,
  isVaiApprovalStatusLoading,
  isInitialLoading,
  isSubmitting,
  isRevokeVaiWalletSpendingLimitLoading,
  revokeVaiWalletSpendingLimit,
  vaiWalletSpendingLimitTokens,
  repayVai,
  vai,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const handleTransactionMutation = useHandleTransactionMutation();

  const limitTokens = React.useMemo(() => {
    const limitWei =
      userBalanceWei && repayBalanceWei
        ? BigNumber.minimum(userBalanceWei, repayBalanceWei)
        : new BigNumber(0);

    let tmpLimitTokens = convertWeiToTokens({ valueWei: limitWei, token: vai });

    if (isVaiApproved && vaiWalletSpendingLimitTokens) {
      tmpLimitTokens = BigNumber.minimum(tmpLimitTokens, vaiWalletSpendingLimitTokens);
    }

    return tmpLimitTokens.toFixed();
  }, [userBalanceWei, repayBalanceWei, vaiWalletSpendingLimitTokens, isVaiApproved]);

  const isRepayingFullLoan = useCallback(
    ({ amountTokens }: { amountTokens: string }) => {
      if (amountTokens && repayBalanceWei) {
        const amountWei = convertTokensToWei({
          value: new BigNumber(amountTokens),
          token: vai,
        });
        return amountWei.isEqualTo(repayBalanceWei);
      }

      return false;
    },
    [repayBalanceWei],
  );

  // Convert repay balance (minted + interests) into VAI
  const readableRepayableVai = useConvertWeiToReadableTokenString({
    valueWei: repayBalanceWei,
    token: vai,
  });

  const readableWalletBalance = useConvertWeiToReadableTokenString({
    valueWei: userBalanceWei,
    token: vai,
  });

  const walletBalanceTokens = useMemo(
    () => userBalanceWei && convertTokensToWei({ value: userBalanceWei, token: vai }),
    [userBalanceWei],
  );

  const hasRepayableVai = repayBalanceWei?.isGreaterThan(0) || false;

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      token: vai,
    });

    return handleTransactionMutation({
      mutate: () =>
        repayVai({
          amountWei,
          isRepayingFullLoan: isRepayingFullLoan({ amountTokens }),
        }),
      successTransactionModalProps: contractReceipt => ({
        title: t('vai.repayVai.successfulTransactionModal.title'),
        content: t('vai.repayVai.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: vai,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  return (
    <ConnectWallet message={t('vai.repayVai.connectWallet')}>
      {isInitialLoading ? (
        <Spinner />
      ) : (
        <AmountForm onSubmit={onSubmit}>
          {({ values, isValid, dirty, setValues }) => (
            <>
              <FormikTokenTextField
                name="amount"
                css={styles.getRow({ isLast: true })}
                token={vai}
                max={limitTokens}
                disabled={disabled || isSubmitting || !hasRepayableVai}
                rightMaxButton={{
                  label: t('vai.repayVai.rightMaxButtonLabel'),
                  onClick: () =>
                    setValues(currentValues => ({ ...currentValues, amount: limitTokens })),
                }}
                data-testid={TEST_IDS.repayTextField}
              />

              <div css={styles.getRow({ isLast: true })}>
                <LabeledInlineContent
                  css={styles.getRow({ isLast: false })}
                  label={t('vai.repayVai.walletBalance')}
                >
                  {readableWalletBalance}
                </LabeledInlineContent>

                <SpendingLimit
                  token={vai}
                  walletBalanceTokens={walletBalanceTokens}
                  walletSpendingLimitTokens={vaiWalletSpendingLimitTokens}
                  onRevoke={revokeVaiWalletSpendingLimit}
                  isRevokeLoading={isRevokeVaiWalletSpendingLimitLoading}
                  data-testid={TEST_IDS.spendingLimit}
                />
              </div>

              <Delimiter css={styles.getRow({ isLast: true })} />

              <LabeledInlineContent
                css={styles.getRow({ isLast: false })}
                iconSrc={vai}
                label={t('vai.repayVai.repayVaiBalance')}
                tooltip={t('vai.repayVai.repayVaiBalanceTooltip')}
              >
                {readableRepayableVai}
              </LabeledInlineContent>

              <RepayFee repayAmountTokens={values.amount} />

              {isRepayingFullLoan({ amountTokens: values.amount }) && (
                <NoticeWarning
                  css={styles.noticeWarning}
                  description={<Trans i18nKey="vai.repayVai.fullRepayWarning" />}
                />
              )}

              <ApproveTokenSteps
                token={vai}
                hideTokenEnablingStep={!isValid || !dirty}
                isTokenApproved={isVaiApproved}
                approveToken={approveVai}
                isApproveTokenLoading={isApproveVaiLoading}
                isWalletSpendingLimitLoading={isVaiApprovalStatusLoading}
              >
                <FormikSubmitButton
                  loading={isSubmitting}
                  disabled={
                    disabled ||
                    !dirty ||
                    isVaiApprovalStatusLoading ||
                    isApproveVaiLoading ||
                    !isVaiApproved ||
                    isRevokeVaiWalletSpendingLimitLoading
                  }
                  enabledLabel={t('vai.repayVai.submitButtonLabel')}
                  disabledLabel={t('vai.repayVai.submitButtonDisabledLabel')}
                  fullWidth
                />
              </ApproveTokenSteps>
            </>
          )}
        </AmountForm>
      )}
    </ConnectWallet>
  );
};

const RepayVai: React.FC = () => {
  const { accountAddress } = useAuth();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const vaiControllerContractAddress = useGetVaiControllerContractAddress();

  const { data: repayAmountWithInterests, isLoading: isGetVaiRepayAmountWithInterests } =
    useGetVaiRepayAmountWithInterests(
      {
        accountAddress: accountAddress || '',
      },
      {
        enabled: !!accountAddress,
      },
    );

  const { data: userVaiBalanceData, isLoading: isGetUserVaiBalance } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: vai!,
    },
    {
      enabled: !!accountAddress,
      refetchInterval: userVaiRefetchInterval,
    },
  );

  const {
    isTokenApproved: isVaiApproved,
    approveToken: approveVai,
    isApproveTokenLoading: isApproveVaiLoading,
    isWalletSpendingLimitLoading: isVaiApprovalStatusLoading,
    walletSpendingLimitTokens: vaiWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeVaiWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeVaiWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: vai!,
    spenderAddress: vaiControllerContractAddress,
    accountAddress,
  });

  const { mutateAsync: contractRepayVai, isLoading: isSubmitting } = useRepayVai();

  const repayVai = async ({
    amountWei,
    isRepayingFullLoan,
  }: {
    amountWei: BigNumber;
    isRepayingFullLoan: boolean;
  }) =>
    contractRepayVai({
      amountWei: isRepayingFullLoan ? MAX_UINT256 : amountWei,
    });

  return (
    <RepayVaiUi
      disabled={!accountAddress}
      userBalanceWei={userVaiBalanceData?.balanceWei}
      repayBalanceWei={repayAmountWithInterests?.vaiRepayAmountWithInterestsWei}
      isInitialLoading={isGetUserVaiBalance || isGetVaiRepayAmountWithInterests}
      isSubmitting={isSubmitting}
      repayVai={repayVai}
      isVaiApproved={isVaiApproved}
      approveVai={approveVai}
      isApproveVaiLoading={isApproveVaiLoading}
      isVaiApprovalStatusLoading={isVaiApprovalStatusLoading}
      vaiWalletSpendingLimitTokens={vaiWalletSpendingLimitTokens}
      isRevokeVaiWalletSpendingLimitLoading={isRevokeVaiWalletSpendingLimitLoading}
      revokeVaiWalletSpendingLimit={revokeVaiWalletSpendingLimit}
      vai={vai!}
    />
  );
};

export default RepayVai;

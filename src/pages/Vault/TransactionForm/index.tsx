/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ApproveTokenSteps,
  ApproveTokenStepsProps,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  SpendingLimit,
} from 'components';
import { ContractReceipt } from 'ethers';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { convertTokensToWei, convertWeiToTokens } from 'utilities';

import { AmountForm } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import useTokenApproval from 'hooks/useTokenApproval';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface TransactionFormUiProps {
  token: Token;
  tokenNeedsToBeApproved?: boolean;
  submitButtonLabel: string;
  submitButtonDisabledLabel: string;
  successfulTransactionTitle: string;
  successfulTransactionDescription: string;
  onSubmit: (amountWei: BigNumber) => Promise<ContractReceipt>;
  isSubmitting: boolean;
  availableTokensWei: BigNumber;
  availableTokensLabel: string;
  isTokenApproved: ApproveTokenStepsProps['isTokenApproved'];
  approveToken: ApproveTokenStepsProps['approveToken'];
  isApproveTokenLoading: ApproveTokenStepsProps['isApproveTokenLoading'];
  isWalletSpendingLimitLoading: ApproveTokenStepsProps['isWalletSpendingLimitLoading'];
  revokeWalletSpendingLimit: () => Promise<unknown>;
  isRevokeWalletSpendingLimitLoading: boolean;
  walletSpendingLimitTokens?: BigNumber;
  lockingPeriodMs?: number;
}

export const TransactionFormUi: React.FC<TransactionFormUiProps> = ({
  token,
  tokenNeedsToBeApproved = false,
  availableTokensWei,
  availableTokensLabel,
  submitButtonLabel,
  submitButtonDisabledLabel,
  successfulTransactionTitle,
  successfulTransactionDescription,
  onSubmit,
  isSubmitting,
  isTokenApproved,
  approveToken,
  isApproveTokenLoading,
  isWalletSpendingLimitLoading,
  walletSpendingLimitTokens,
  revokeWalletSpendingLimit,
  isRevokeWalletSpendingLimitLoading,
  lockingPeriodMs,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleTransactionMutation = useHandleTransactionMutation();

  const availableTokens = React.useMemo(
    () =>
      convertWeiToTokens({
        valueWei: availableTokensWei,
        token,
      }),
    [availableTokensWei],
  );

  const limitTokens = useMemo(() => {
    if (isTokenApproved && walletSpendingLimitTokens) {
      return BigNumber.minimum(availableTokens, walletSpendingLimitTokens);
    }

    return availableTokens;
  }, [availableTokens, isTokenApproved, walletSpendingLimitTokens]);

  const readableAvailableTokens = useConvertWeiToReadableTokenString({
    valueWei: availableTokensWei,
    token,
  });

  const readableLockingPeriod = React.useMemo(() => {
    if (!lockingPeriodMs) {
      return undefined;
    }

    const now = new Date();
    const unlockingDate = new Date(now.getTime() + lockingPeriodMs);

    return t('vault.transactionForm.lockingPeriod.duration', { date: unlockingDate });
  }, [lockingPeriodMs?.toFixed()]);

  const handleSubmit = async (amountTokens: string) => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      token,
    });

    return handleTransactionMutation({
      mutate: () => onSubmit(amountWei),
      successTransactionModalProps: contractReceipt => ({
        title: successfulTransactionTitle,
        content: successfulTransactionDescription,
        amount: {
          valueWei: amountWei,
          token,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  return (
    <AmountForm onSubmit={handleSubmit} maxAmount={limitTokens.toFixed()}>
      {({ dirty, isValid, setFieldValue }) => (
        <>
          <FormikTokenTextField
            name="amount"
            token={token}
            disabled={isSubmitting}
            rightMaxButton={{
              label: t('vault.transactionForm.rightMaxButtonLabel'),
              onClick: () => setFieldValue('amount', limitTokens.toFixed()),
            }}
            max={limitTokens.toFixed()}
            data-testid={TEST_IDS.tokenTextField}
            css={styles.tokenTextField}
          />

          <div css={styles.getRow({ isLast: true })}>
            <LabeledInlineContent
              data-testid={TEST_IDS.availableTokens}
              iconSrc={token}
              label={availableTokensLabel}
              css={styles.getRow({ isLast: false })}
            >
              {readableAvailableTokens}
            </LabeledInlineContent>

            {tokenNeedsToBeApproved && (
              <SpendingLimit
                token={token}
                walletBalanceTokens={availableTokens}
                walletSpendingLimitTokens={walletSpendingLimitTokens}
                onRevoke={revokeWalletSpendingLimit}
                isRevokeLoading={isRevokeWalletSpendingLimitLoading}
                css={styles.getRow({ isLast: false })}
                data-testid={TEST_IDS.spendingLimit}
              />
            )}

            {readableLockingPeriod && (
              <LabeledInlineContent
                data-testid={TEST_IDS.lockingPeriod}
                label={t('vault.transactionForm.lockingPeriod.label')}
                css={styles.getRow({ isLast: false })}
              >
                {readableLockingPeriod}
              </LabeledInlineContent>
            )}
          </div>

          {tokenNeedsToBeApproved ? (
            <ApproveTokenSteps
              token={token}
              hideTokenEnablingStep={!isValid || !dirty}
              isTokenApproved={isTokenApproved}
              approveToken={approveToken}
              isApproveTokenLoading={isApproveTokenLoading}
              isWalletSpendingLimitLoading={isWalletSpendingLimitLoading}
            >
              <FormikSubmitButton
                loading={isSubmitting}
                disabled={
                  !isValid ||
                  !dirty ||
                  isSubmitting ||
                  !isTokenApproved ||
                  isApproveTokenLoading ||
                  isWalletSpendingLimitLoading ||
                  isRevokeWalletSpendingLimitLoading
                }
                className="w-full"
                enabledLabel={submitButtonLabel}
                disabledLabel={submitButtonDisabledLabel}
              />
            </ApproveTokenSteps>
          ) : (
            <FormikSubmitButton
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              className="w-full"
              enabledLabel={submitButtonLabel}
              disabledLabel={submitButtonDisabledLabel}
            />
          )}
        </>
      )}
    </AmountForm>
  );
};

export interface TransactionFormProps
  extends Omit<
    TransactionFormUiProps,
    | 'isTokenApproved'
    | 'approveToken'
    | 'isApproveTokenLoading'
    | 'isWalletSpendingLimitLoading'
    | 'isWalletSpendingLimitLoading'
    | 'revokeWalletSpendingLimit'
    | 'isRevokeWalletSpendingLimitLoading'
  > {
  spenderAddress?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  token,
  tokenNeedsToBeApproved = false,
  spenderAddress,
  ...otherProps
}) => {
  const { accountAddress } = useAuth();

  const tokenApprovalProps = useTokenApproval({
    token,
    spenderAddress,
    accountAddress,
  });

  return (
    <TransactionFormUi
      token={token}
      tokenNeedsToBeApproved={tokenNeedsToBeApproved}
      {...tokenApprovalProps}
      {...otherProps}
    />
  );
};

export default TransactionForm;

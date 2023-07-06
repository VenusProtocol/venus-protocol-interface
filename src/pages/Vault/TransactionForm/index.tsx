/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ApproveTokenSteps,
  ApproveTokenStepsProps,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
} from 'components';
import { ContractReceipt } from 'ethers';
import React from 'react';
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
  lockingPeriodMs,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const handleTransactionMutation = useHandleTransactionMutation();

  const stringifiedAvailableTokens = React.useMemo(
    () =>
      convertWeiToTokens({
        valueWei: availableTokensWei,
        token,
      }).toFixed(),
    [availableTokensWei.toFixed()],
  );

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
    <AmountForm onSubmit={handleSubmit} maxAmount={stringifiedAvailableTokens}>
      {({ dirty, isValid, setFieldValue }) => (
        <>
          <FormikTokenTextField
            name="amount"
            token={token}
            disabled={isSubmitting}
            rightMaxButton={{
              label: t('vault.transactionForm.rightMaxButtonLabel'),
              onClick: () => setFieldValue('amount', stringifiedAvailableTokens),
            }}
            max={stringifiedAvailableTokens}
            data-testid={TEST_IDS.tokenTextField}
            css={styles.tokenTextField}
          />

          <LabeledInlineContent
            data-testid={TEST_IDS.availableTokens}
            iconSrc={token}
            label={availableTokensLabel}
            css={styles.getRow({ isLast: !readableLockingPeriod })}
          >
            {readableAvailableTokens}
          </LabeledInlineContent>

          {readableLockingPeriod && (
            <LabeledInlineContent
              data-testid={TEST_IDS.lockingPeriod}
              label={t('vault.transactionForm.lockingPeriod.label')}
              css={styles.getRow({ isLast: true })}
            >
              {readableLockingPeriod}
            </LabeledInlineContent>
          )}

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
                  isWalletSpendingLimitLoading
                }
                fullWidth
                enabledLabel={submitButtonLabel}
                disabledLabel={submitButtonDisabledLabel}
              />
            </ApproveTokenSteps>
          ) : (
            <FormikSubmitButton
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              fullWidth
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
    'isTokenApproved' | 'approveToken' | 'isApproveTokenLoading' | 'isWalletSpendingLimitLoading'
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

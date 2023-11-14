import BigNumber from 'bignumber.js';
import {
  ApproveTokenSteps,
  ApproveTokenStepsProps,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  NoticeWarning,
  SpendingLimit,
} from 'components';
import { displayMutationError } from 'errors';
import { useTranslation } from 'packages/translations';
import { useCallback, useMemo } from 'react';
import { Token } from 'types';
import { cn, convertTokensToWei, convertWeiToTokens } from 'utilities';

import { AmountForm } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useTokenApproval from 'hooks/useTokenApproval';

import TEST_IDS from './testIds';

export interface TransactionFormUiProps {
  token: Token;
  tokenNeedsToBeApproved?: boolean;
  submitButtonLabel: string;
  submitButtonDisabledLabel: string;
  onSubmit: (amountWei: BigNumber) => Promise<unknown>;
  isSubmitting: boolean;
  availableTokensWei: BigNumber;
  availableTokensLabel: string;
  isTokenApproved: ApproveTokenStepsProps['isTokenApproved'];
  approveToken: ApproveTokenStepsProps['approveToken'];
  isApproveTokenLoading: ApproveTokenStepsProps['isApproveTokenLoading'];
  isWalletSpendingLimitLoading: ApproveTokenStepsProps['isWalletSpendingLimitLoading'];
  revokeWalletSpendingLimit: () => Promise<unknown>;
  isRevokeWalletSpendingLimitLoading: boolean;
  warning?: {
    amountTokens: BigNumber;
    message: string;
    submitButtonLabel: string;
  };
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
  warning,
}) => {
  const { t } = useTranslation();

  const availableTokens = useMemo(
    () =>
      convertWeiToTokens({
        valueWei: availableTokensWei,
        token,
      }),
    [availableTokensWei, token],
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

  const readableLockingPeriod = useMemo(() => {
    if (!lockingPeriodMs) {
      return undefined;
    }

    const now = new Date();
    const unlockingDate = new Date(now.getTime() + lockingPeriodMs);

    return t('vault.transactionForm.lockingPeriod.duration', { date: unlockingDate });
  }, [lockingPeriodMs, t]);

  const shouldDisplayWarning = useCallback(
    (amountTokens: string) =>
      !!amountTokens && warning?.amountTokens.isLessThanOrEqualTo(amountTokens),
    [warning],
  );

  const handleSubmit = async (amountTokens: string) => {
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      token,
    });

    try {
      await onSubmit(amountWei);
    } catch (error) {
      displayMutationError({ error });
    }
  };

  return (
    <AmountForm onSubmit={handleSubmit} maxAmount={limitTokens.toFixed()}>
      {({ dirty, isValid, setFieldValue, values }) => (
        <div className="space-y-6">
          <div>
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
            />

            {warning && shouldDisplayWarning(values.amount) && (
              <NoticeWarning
                description={warning.message}
                data-testid={TEST_IDS.noticeWarning}
                className="mt-3"
              />
            )}
          </div>

          <div className="space-y-3">
            <LabeledInlineContent
              data-testid={TEST_IDS.availableTokens}
              iconSrc={token}
              label={availableTokensLabel}
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
                data-testid={TEST_IDS.spendingLimit}
              />
            )}

            {readableLockingPeriod && (
              <LabeledInlineContent
                data-testid={TEST_IDS.lockingPeriod}
                label={t('vault.transactionForm.lockingPeriod.label')}
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
              enabledLabel={
                warning && shouldDisplayWarning(values.amount)
                  ? warning.submitButtonLabel
                  : submitButtonLabel
              }
              className={cn('w-full', shouldDisplayWarning(values.amount) && 'border-red bg-red')}
              disabledLabel={submitButtonDisabledLabel}
            />
          )}
        </div>
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
  poolIndex?: number;
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

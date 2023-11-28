import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import {
  ApproveTokenSteps,
  ApproveTokenStepsProps,
  FormikSubmitButton,
  FormikTokenTextField,
  LabeledInlineContent,
  NoticeWarning,
  SpendingLimit,
} from 'components';
import { AmountForm } from 'containers/AmountForm';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useTokenApproval from 'hooks/useTokenApproval';
import { displayMutationError } from 'packages/errors';
import { useTranslation } from 'packages/translations';
import { useAccountAddress } from 'packages/wallet';
import { Token } from 'types';
import { cn, convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import TEST_IDS from './testIds';

export interface TransactionFormUiProps {
  token: Token;
  tokenNeedsToBeApproved?: boolean;
  submitButtonLabel: string;
  submitButtonDisabledLabel: string;
  onSubmit: (amountMantissa: BigNumber) => Promise<unknown>;
  isSubmitting: boolean;
  availableTokensMantissa: BigNumber;
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
  availableTokensMantissa,
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
      convertMantissaToTokens({
        value: availableTokensMantissa,
        token,
      }),
    [availableTokensMantissa, token],
  );

  const limitTokens = useMemo(() => {
    if (isTokenApproved && walletSpendingLimitTokens) {
      return BigNumber.minimum(availableTokens, walletSpendingLimitTokens);
    }

    return availableTokens;
  }, [availableTokens, isTokenApproved, walletSpendingLimitTokens]);

  const readableAvailableTokens = useConvertMantissaToReadableTokenString({
    value: availableTokensMantissa,
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
    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(amountTokens),
      token,
    });

    try {
      await onSubmit(amountMantissa);
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
  const { accountAddress } = useAccountAddress();

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

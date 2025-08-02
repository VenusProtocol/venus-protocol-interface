import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';

import {
  type ApproveTokenStepsProps,
  LabeledInlineContent,
  NoticeWarning,
  SpendingLimit,
} from 'components';
import { AmountForm } from 'containers/AmountForm';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useTokenApproval from 'hooks/useTokenApproval';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import { FormikTokenTextField } from 'containers/Form';
import type { Address } from 'viem';
import { SubmitSection } from './SubmitSection';
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
      amountTokens && warning ? warning.amountTokens.isLessThanOrEqualTo(amountTokens) : false,
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
      handleError({ error });
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

          <SubmitSection
            token={token}
            tokenNeedsToBeApproved={tokenNeedsToBeApproved}
            approveToken={approveToken}
            isFormValid={isValid && dirty}
            isSubmitting={isSubmitting}
            isTokenApproved={tokenNeedsToBeApproved ? !!isTokenApproved : true}
            isApproveTokenLoading={isApproveTokenLoading}
            isWalletSpendingLimitLoading={isWalletSpendingLimitLoading}
            isRevokeWalletSpendingLimitLoading={isRevokeWalletSpendingLimitLoading}
            submitButtonEnabledLabel={
              warning && shouldDisplayWarning(values.amount)
                ? warning.submitButtonLabel
                : submitButtonLabel
            }
            submitButtonDisabledLabel={submitButtonDisabledLabel}
            isDangerousAction={shouldDisplayWarning(values.amount)}
          />
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
  spenderAddress?: Address;
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

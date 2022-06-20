/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { FormikSubmitButton, FormikTokenTextField, LabeledInlineContent, toast } from 'components';
import { AmountForm } from 'containers/AmountForm';
import { VError, formatVErrorToReadableString } from 'errors';
import { TokenId } from 'types';
import { useTranslation } from 'translation';
import { convertWeiToCoins, convertCoinsToWei } from 'utilities';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import TEST_IDS from 'constants/testIds';
import { useStyles } from './styles';

export interface ITransactionFormProps {
  tokenId: TokenId;
  submitButtonLabel: string;
  submitButtonDisabledLabel: string;
  successfulTransactionTitle: string;
  successfulTransactionDescription: string;
  onSubmit: (amountWei: BigNumber) => Promise<TransactionReceipt>;
  isSubmitting: boolean;
  availableTokensWei: BigNumber;
  availableTokensLabel: string;
  lockingPeriodMs?: number;
}

const TransactionForm: React.FC<ITransactionFormProps> = ({
  tokenId,
  availableTokensWei,
  availableTokensLabel,
  submitButtonLabel,
  submitButtonDisabledLabel,
  successfulTransactionTitle,
  successfulTransactionDescription,
  onSubmit,
  isSubmitting,
  lockingPeriodMs,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const stringifiedAvailableTokens = React.useMemo(
    () =>
      convertWeiToCoins({
        valueWei: availableTokensWei,
        tokenId,
      }).toFixed(),
    [availableTokensWei.toFixed()],
  );

  const readableAvailableTokens = useConvertToReadableCoinString({
    valueWei: availableTokensWei,
    tokenId,
    minimizeDecimals: true,
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
    try {
      const amountWei = convertCoinsToWei({
        value: new BigNumber(amountTokens),
        tokenId,
      });

      // Submit form
      const res = await onSubmit(amountWei);

      // Display successful transaction modal
      if (res) {
        openSuccessfulTransactionModal({
          title: successfulTransactionTitle,
          content: successfulTransactionDescription,
          amount: {
            valueWei: amountWei,
            tokenId,
          },
          transactionHash: res.transactionHash,
        });
      }
    } catch (error) {
      let { message } = error as Error;
      if (error instanceof VError) {
        message = formatVErrorToReadableString(error);
      }
      toast.error({
        message,
      });
    }
  };

  return (
    <AmountForm onSubmit={handleSubmit} maxAmount={stringifiedAvailableTokens}>
      {({ dirty, isValid }) => (
        <>
          <FormikTokenTextField
            name="amount"
            tokenId={tokenId}
            disabled={isSubmitting}
            rightMaxButton={{
              label: t('vault.transactionForm.rightMaxButtonLabel'),
              valueOnClick: stringifiedAvailableTokens,
            }}
            max={stringifiedAvailableTokens}
            data-testid={TEST_IDS.vault.transactionForm.tokenTextField}
            css={styles.tokenTextField}
          />

          <LabeledInlineContent
            data-testid={TEST_IDS.vault.transactionForm.availableTokens}
            iconName={tokenId}
            label={availableTokensLabel}
            css={styles.getRow({ isLast: !readableLockingPeriod })}
          >
            {readableAvailableTokens}
          </LabeledInlineContent>

          {readableLockingPeriod && (
            <LabeledInlineContent
              data-testid={TEST_IDS.vault.transactionForm.lockingPeriod}
              label={t('vault.transactionForm.lockingPeriod.label')}
              css={styles.getRow({ isLast: true })}
            >
              {readableLockingPeriod}
            </LabeledInlineContent>
          )}

          <FormikSubmitButton
            loading={isSubmitting}
            disabled={!isValid || !dirty || isSubmitting}
            fullWidth
            enabledLabel={submitButtonLabel}
            disabledLabel={submitButtonDisabledLabel}
          />
        </>
      )}
    </AmountForm>
  );
};

export default TransactionForm;

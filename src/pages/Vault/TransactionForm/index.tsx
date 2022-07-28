/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { FormikSubmitButton, FormikTokenTextField, LabeledInlineContent } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { convertTokensToWei, convertWeiToTokens } from 'utilities';
import type { TransactionReceipt } from 'web3-core/types';

import { AmountForm } from 'containers/AmountForm';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface TransactionFormProps {
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

const TransactionForm: React.FC<TransactionFormProps> = ({
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

  const handleTransactionMutation = useHandleTransactionMutation();

  const stringifiedAvailableTokens = React.useMemo(
    () =>
      convertWeiToTokens({
        valueWei: availableTokensWei,
        tokenId,
      }).toFixed(),
    [availableTokensWei.toFixed()],
  );

  const readableAvailableTokens = useConvertWeiToReadableTokenString({
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
    const amountWei = convertTokensToWei({
      value: new BigNumber(amountTokens),
      tokenId,
    });

    return handleTransactionMutation({
      mutate: () => onSubmit(amountWei),
      successTransactionModalProps: transactionReceipt => ({
        title: successfulTransactionTitle,
        content: successfulTransactionDescription,
        amount: {
          valueWei: amountWei,
          tokenId,
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
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
            data-testid={TEST_IDS.tokenTextField}
            css={styles.tokenTextField}
          />

          <LabeledInlineContent
            data-testid={TEST_IDS.availableTokens}
            iconName={tokenId}
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

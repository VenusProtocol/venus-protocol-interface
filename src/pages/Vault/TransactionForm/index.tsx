/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { FormikSubmitButton, FormikTokenTextField, LabeledInlineContent } from 'components';
import { AmountForm } from 'containers/AmountForm';
import { TokenId } from 'types';
import { useTranslation } from 'translation';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import { convertWeiToTokens, convertTokensToWei } from 'utilities';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
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

/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { FormikSubmitButton, FormikTokenTextField, LabeledInlineContent } from 'components';
import { AmountForm, IAmountFormProps } from 'containers/AmountForm';
import { TokenId } from 'types';
import { useTranslation } from 'translation';
import { convertWeiToCoins } from 'utilities';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { useStyles } from './styles';

export interface ITransactionFormProps {
  tokenId: TokenId;
  title: string;
  submitButtonLabel: string;
  submitButtonDisabledLabel: string;
  onSubmit: IAmountFormProps['onSubmit'];
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
  onSubmit,
  isSubmitting,
  lockingPeriodMs,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

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

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={stringifiedAvailableTokens}>
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
            data-testid="token-text-field"
            css={styles.tokenTextField}
          />

          <LabeledInlineContent
            iconName={tokenId}
            label={availableTokensLabel}
            css={styles.getRow({ isLast: !readableLockingPeriod })}
          >
            {readableAvailableTokens}
          </LabeledInlineContent>

          {readableLockingPeriod && (
            <LabeledInlineContent
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

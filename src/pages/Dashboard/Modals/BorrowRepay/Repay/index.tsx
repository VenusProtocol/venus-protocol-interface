/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';

import { Asset, VTokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import { AmountForm, IAmountFormProps, ErrorCode } from 'containers/AmountForm';
import {
  formatApy,
  convertCoinsToWei,
  formatCoinsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import { useRepayVToken } from 'clients/api';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import toast from 'components/Basic/Toast';
import {
  PrimaryButton,
  TokenTextField,
  ConnectWallet,
  EnableToken,
  LabeledInlineContent,
  TertiaryButton,
} from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';
import { useStyles as useRepayStyles } from './styles';
import AccountData from '../AccountData';

export interface IRepayFormProps {
  asset: Asset;
  repay: (amountWei: BigNumber) => Promise<string>;
  isRepayLoading: boolean;
}

export const RepayForm: React.FC<IRepayFormProps> = ({ asset, repay, isRepayLoading }) => {
  const { t, Trans } = useTranslation();

  const sharedStyles = useStyles();
  const repayStyles = useRepayStyles();
  const styles = {
    ...sharedStyles,
    ...repayStyles,
  };

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const limitTokens = BigNumber.min(asset.borrowBalance, asset.walletBalance).toFixed();

  const getTokenBorrowBalancePercentageTokens = React.useCallback(
    (percentage: number) =>
      asset.borrowBalance
        .multipliedBy(percentage / 100)
        .decimalPlaces(asset.decimals)
        .toString(),
    [asset.borrowBalance.toFixed(), asset.decimals],
  );

  const readableTokenBorrowBalance = React.useMemo(
    () =>
      formatCoinsToReadableValue({
        value: asset.borrowBalance,
        tokenId: asset.id,
      }),
    [asset.borrowBalance.toFixed(), asset.id],
  );

  const readableTokenWalletBalance = React.useMemo(
    () =>
      formatCoinsToReadableValue({
        value: asset.walletBalance,
        tokenId: asset.id,
      }),
    [asset.walletBalance.toFixed(), asset.id],
  );

  const onSubmit: IAmountFormProps['onSubmit'] = async amountTokens => {
    const formattedAmountTokens = new BigNumber(amountTokens);

    const amountWei = convertCoinsToWei({
      value: formattedAmountTokens,
      tokenId: asset.id,
    });

    try {
      // Send request to repay tokens
      const transactionHash = await repay(amountWei);

      // Display successful transaction modal
      openSuccessfulTransactionModal({
        title: t('borrowRepayModal.repay.successfulTransactionModal.title'),
        message: t('borrowRepayModal.repay.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: asset.id,
        },
        transactionHash,
      });
    } catch (error) {
      toast.error({ title: (error as Error).message });
    }
  };

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
      {({ values, setFieldValue, handleBlur, dirty, isValid, errors }) => (
        <>
          <LabeledInlineContent
            css={styles.getRow({ isLast: true })}
            label={t('borrowRepayModal.repay.currentlyBorrowing')}
          >
            {readableTokenBorrowBalance}
          </LabeledInlineContent>

          <div css={[styles.getRow({ isLast: true })]}>
            <TokenTextField
              name="amount"
              tokenId={asset.id}
              css={styles.input}
              value={values.amount}
              onChange={amount => setFieldValue('amount', amount, true)}
              disabled={isRepayLoading}
              onBlur={handleBlur}
              rightMaxButton={{
                label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
                valueOnClick: limitTokens,
              }}
              data-testid="token-text-field"
              // Only display error state if amount is higher than limit
              hasError={errors.amount === ErrorCode.HIGHER_THAN_MAX}
            />

            <Typography
              component="div"
              variant="small2"
              css={[styles.greyLabel, styles.walletBalance]}
            >
              <Trans
                i18nKey="borrowRepayModal.repay.walletBalance"
                components={{
                  White: <span css={styles.whiteLabel} />,
                }}
                values={{ balance: readableTokenWalletBalance }}
              />
            </Typography>

            <div css={styles.selectButtonsContainer}>
              {[25, 50, 75, 100].map(percentage => (
                <TertiaryButton
                  key={`select-button-${percentage}`}
                  css={styles.selectButton}
                  onClick={() =>
                    setFieldValue('amount', getTokenBorrowBalancePercentageTokens(percentage), true)
                  }
                >
                  {formatToReadablePercentage(percentage)}
                </TertiaryButton>
              ))}
            </div>
          </div>

          <AccountData hypotheticalBorrowAmountTokens={-values.amount} asset={asset} />

          <PrimaryButton
            type="submit"
            loading={isRepayLoading}
            disabled={!isValid || !dirty || isRepayLoading}
            fullWidth
          >
            {dirty && isValid
              ? t('borrowRepayModal.repay.submitButton')
              : t('borrowRepayModal.repay.submitButtonDisabled')}
          </PrimaryButton>
        </>
      )}
    </AmountForm>
  );
};

export interface IRepayProps {
  asset: Asset;
  onClose: () => void;
}

const Repay: React.FC<IRepayProps> = ({ asset, onClose }) => {
  const { t } = useTranslation();
  const { account } = React.useContext(AuthContext);

  const { mutateAsync: repay, isLoading: isRepayLoading } = useRepayVToken({
    vTokenId: asset.id as VTokenId,
  });

  const handleRepay: IRepayFormProps['repay'] = async amountWei => {
    if (!account?.address) {
      throw new Error(t('errors.walletNotConnected'));
    }

    const res = await repay({
      amountWei,
      fromAccountAddress: account.address,
    });

    // Close modal on success
    onClose();

    return res.transactionHash;
  };

  return (
    <ConnectWallet message={t('borrowRepayModal.repay.connectWalletMessage')}>
      {asset && (
        <EnableToken
          symbol={asset.id}
          title={t('borrowRepayModal.repay.enableToken.title', { symbol: asset.symbol })}
          tokenInfo={[
            {
              label: t('borrowRepayModal.repay.enableToken.borrowInfo'),
              iconName: asset.id,
              children: formatApy(asset.borrowApy),
            },
            {
              label: t('borrowRepayModal.repay.enableToken.distributionInfo'),
              iconName: 'xvs',
              children: formatApy(asset.xvsBorrowApy),
            },
          ]}
          isEnabled={asset.isEnabled}
          vtokenAddress={asset.vtokenAddress}
        >
          <RepayForm asset={asset} repay={handleRepay} isRepayLoading={isRepayLoading} />
        </EnableToken>
      )}
    </ConnectWallet>
  );
};

export default Repay;

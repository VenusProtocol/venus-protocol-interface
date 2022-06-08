/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { Asset, VTokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import { AmountForm, IAmountFormProps, ErrorCode } from 'containers/AmountForm';
import {
  convertCoinsToWei,
  formatCoinsToReadableValue,
  formatToReadablePercentage,
} from 'utilities/common';
import { useRepayVToken } from 'clients/api';
import { VError, formatVErrorToReadableString } from 'errors';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import {
  toast,
  PrimaryButton,
  TokenTextField,
  ConnectWallet,
  EnableToken,
  LabeledInlineContent,
  TertiaryButton,
  NoticeWarning,
} from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';
import { useStyles as useRepayStyles } from './styles';
import AccountData from '../AccountData';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface IRepayFormProps {
  asset: Asset;
  repay: (amountWei: BigNumber) => Promise<string | undefined>;
  isRepayLoading: boolean;
  isXvsEnabled: boolean;
  limitTokens: string;
  dailyXvsDistributionInterestsCents: BigNumber;
}

export const RepayForm: React.FC<IRepayFormProps> = ({
  asset,
  repay,
  isRepayLoading,
  isXvsEnabled,
  limitTokens,
  dailyXvsDistributionInterestsCents,
}) => {
  const { t, Trans } = useTranslation();

  const sharedStyles = useStyles();
  const repayStyles = useRepayStyles();
  const styles = {
    ...sharedStyles,
    ...repayStyles,
  };

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const getTokenBorrowBalancePercentageTokens = React.useCallback(
    (percentage: number) =>
      asset.borrowBalance
        .multipliedBy(percentage / 100)
        .decimalPlaces(asset.decimals)
        .toFixed(),
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
      if (transactionHash) {
        // Display successful transaction modal
        openSuccessfulTransactionModal({
          title: t('borrowRepayModal.repay.successfulTransactionModal.title'),
          content: t('borrowRepayModal.repay.successfulTransactionModal.message'),
          amount: {
            valueWei: amountWei,
            tokenId: asset.id,
          },
          transactionHash,
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

  const shouldDisplayFullRepaymentWarning = React.useCallback(
    (repayAmountTokens: string) =>
      repayAmountTokens !== '0' && asset.borrowBalance.eq(repayAmountTokens),
    [asset.id, asset.borrowBalance.toFixed()],
  );

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

          <div css={[styles.getRow({ isLast: false })]}>
            <TokenTextField
              name="amount"
              tokenId={asset.id}
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
              description={
                <Trans
                  i18nKey="borrowRepayModal.repay.walletBalance"
                  components={{
                    White: <span css={styles.whiteLabel} />,
                  }}
                  values={{ balance: readableTokenWalletBalance }}
                />
              }
            />
          </div>

          <div css={[styles.getRow({ isLast: true })]}>
            <div css={styles.selectButtonsContainer}>
              {PRESET_PERCENTAGES.map(percentage => (
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

            {shouldDisplayFullRepaymentWarning(values.amount) && (
              <NoticeWarning
                css={styles.notice}
                description={t('borrowRepayModal.repay.fullRepaymentWarning')}
              />
            )}
          </div>

          <AccountData
            hypotheticalBorrowAmountTokens={-values.amount}
            asset={asset}
            isXvsEnabled={isXvsEnabled}
            dailyXvsDistributionInterestsCents={dailyXvsDistributionInterestsCents}
          />

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
  isXvsEnabled: boolean;
  onClose: () => void;
  dailyXvsDistributionInterestsCents: BigNumber;
}

const Repay: React.FC<IRepayProps> = ({
  asset,
  onClose,
  isXvsEnabled,
  dailyXvsDistributionInterestsCents,
}) => {
  const { t } = useTranslation();
  const { account } = React.useContext(AuthContext);

  const limitTokens = React.useMemo(
    () => BigNumber.min(asset.borrowBalance, asset.walletBalance),
    [asset.borrowBalance, asset.walletBalance],
  );

  const { mutateAsync: repay, isLoading: isRepayLoading } = useRepayVToken({
    vTokenId: asset.id as VTokenId,
  });

  const handleRepay: IRepayFormProps['repay'] = async amountWei => {
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    const isRepayingFullLoan = amountWei.eq(
      convertCoinsToWei({ value: asset.borrowBalance, tokenId: asset.id }),
    );

    const res = await repay({
      amountWei,
      fromAccountAddress: account.address,
      isRepayingFullLoan,
    });

    // Close modal on success
    onClose();

    return res.transactionHash;
  };

  return (
    <ConnectWallet message={t('borrowRepayModal.repay.connectWalletMessage')}>
      {asset && (
        <EnableToken
          vTokenId={asset.id}
          title={t('borrowRepayModal.repay.enableToken.title', { symbol: asset.symbol })}
          tokenInfo={[
            {
              label: t('borrowRepayModal.repay.enableToken.borrowInfo'),
              iconName: asset.id,
              children: formatToReadablePercentage(asset.borrowApy),
            },
            {
              label: t('borrowRepayModal.repay.enableToken.distributionInfo'),
              iconName: 'xvs',
              children: formatToReadablePercentage(asset.xvsBorrowApy),
            },
          ]}
        >
          <RepayForm
            asset={asset}
            repay={handleRepay}
            isXvsEnabled={isXvsEnabled}
            isRepayLoading={isRepayLoading}
            limitTokens={limitTokens.toFixed()}
            dailyXvsDistributionInterestsCents={dailyXvsDistributionInterestsCents}
          />
        </EnableToken>
      )}
    </ConnectWallet>
  );
};

export default Repay;

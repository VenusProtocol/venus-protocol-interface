/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  AccountData,
  ConnectWallet,
  EnableToken,
  LabeledInlineContent,
  NoticeWarning,
  PrimaryButton,
  Spinner,
  TertiaryButton,
  TokenTextField,
  toast,
} from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool, VToken } from 'types';
import {
  areTokensEqual,
  convertTokensToWei,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';

import { useGetPool, useRepay } from 'clients/api';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useAssetInfo from 'hooks/useAssetInfo';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { useStyles as useSharedStyles } from '../styles';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

// TODO: add stories

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface RepayFormProps {
  repay: (amountWei: BigNumber) => Promise<string | undefined>;
  isRepayLoading: boolean;
  limitTokens: string;
  asset: Asset;
  pool: Pool;
}

export const RepayForm: React.FC<RepayFormProps> = ({
  asset,
  pool,
  repay,
  isRepayLoading,
  limitTokens,
}) => {
  const { t, Trans } = useTranslation();

  const sharedStyles = useSharedStyles();
  const styles = useStyles();

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const getTokenBorrowBalancePercentageTokens = React.useCallback(
    (percentage: number) =>
      asset.userBorrowBalanceTokens
        .multipliedBy(percentage / 100)
        .decimalPlaces(asset.vToken.underlyingToken.decimals)
        .toFixed(),
    [asset.userBorrowBalanceTokens, asset.vToken.underlyingToken.decimals],
  );

  const readableTokenBorrowBalance = React.useMemo(
    () =>
      formatTokensToReadableValue({
        value: asset.userBorrowBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
    [asset.userBorrowBalanceTokens, asset.vToken.underlyingToken],
  );

  const readableTokenWalletBalance = React.useMemo(
    () =>
      formatTokensToReadableValue({
        value: asset.userWalletBalanceTokens,
        token: asset.vToken.underlyingToken,
      }),
    [asset.userWalletBalanceTokens, asset.vToken.underlyingToken],
  );

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const formattedAmountTokens = new BigNumber(amountTokens);

    const amountWei = convertTokensToWei({
      value: formattedAmountTokens,
      token: asset.vToken.underlyingToken,
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
            token: asset.vToken.underlyingToken,
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
      repayAmountTokens !== '0' && asset.userBorrowBalanceTokens.eq(repayAmountTokens),
    [asset.vToken.underlyingToken, asset.userBorrowBalanceTokens],
  );

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
      {({ values, setFieldValue, handleBlur, dirty, isValid, errors }) => (
        <>
          <LabeledInlineContent
            css={sharedStyles.getRow({ isLast: true })}
            label={t('borrowRepayModal.repay.currentlyBorrowing')}
          >
            {readableTokenBorrowBalance}
          </LabeledInlineContent>

          <div css={[sharedStyles.getRow({ isLast: false })]}>
            <TokenTextField
              name="amount"
              token={asset.vToken.underlyingToken}
              value={values.amount}
              onChange={amount => setFieldValue('amount', amount, true)}
              disabled={isRepayLoading}
              onBlur={handleBlur}
              rightMaxButton={{
                label: t('borrowRepayModal.repay.rightMaxButtonLabel'),
                valueOnClick: limitTokens,
              }}
              data-testid={TEST_IDS.tokenTextField}
              // Only display error state if amount is higher than limit
              hasError={errors.amount === ErrorCode.HIGHER_THAN_MAX}
              description={
                <Trans
                  i18nKey="borrowRepayModal.repay.walletBalance"
                  components={{
                    White: <span css={sharedStyles.whiteLabel} />,
                  }}
                  values={{ balance: readableTokenWalletBalance }}
                />
              }
            />
          </div>

          <div css={[sharedStyles.getRow({ isLast: true })]}>
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
                css={sharedStyles.notice}
                description={t('borrowRepayModal.repay.fullRepaymentWarning')}
              />
            )}
          </div>

          <AccountData
            asset={asset}
            pool={pool}
            amountTokens={new BigNumber(values.amount || 0)}
            action="repay"
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

export interface RepayProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  onClose: () => void;
}

const Repay: React.FC<RepayProps> = ({ vToken, poolComptrollerAddress, onClose }) => {
  const { t } = useTranslation();
  const { account } = useAuth();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
    accountAddress: account?.address,
  });
  const pool = getPoolData?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  const limitTokens = React.useMemo(
    () =>
      asset
        ? BigNumber.min(asset.userBorrowBalanceTokens, asset.userWalletBalanceTokens)
        : new BigNumber(0),
    [asset?.userBorrowBalanceTokens, asset?.userWalletBalanceTokens],
  );

  const { mutateAsync: repay, isLoading: isRepayLoading } = useRepay({
    vToken,
  });

  const assetInfo = useAssetInfo({
    asset,
    type: 'borrow',
  });

  const handleRepay: RepayFormProps['repay'] = async amountWei => {
    const isRepayingFullLoan = amountWei.eq(
      convertTokensToWei({
        value: asset!.userBorrowBalanceTokens,
        token: asset!.vToken.underlyingToken,
      }),
    );

    const res = await repay({
      amountWei,
      isRepayingFullLoan,
    });

    // Close modal on success
    onClose();

    return res.transactionHash;
  };

  return (
    <ConnectWallet message={t('borrowRepayModal.repay.connectWalletMessage')}>
      {asset && pool ? (
        <EnableToken
          token={vToken.underlyingToken}
          spenderAddress={vToken.address}
          title={t('borrowRepayModal.repay.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          assetInfo={assetInfo}
        >
          <RepayForm
            asset={asset}
            pool={pool}
            repay={handleRepay}
            isRepayLoading={isRepayLoading}
            limitTokens={limitTokens.toFixed()}
          />
        </EnableToken>
      ) : (
        <Spinner />
      )}
    </ConnectWallet>
  );
};

export default Repay;

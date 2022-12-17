/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
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
import { Asset, VToken } from 'types';
import {
  convertTokensToWei,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';

import { useGetUserAsset, useRepay } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import AccountData from '../AccountData';
import { useStyles as useSharedStyles } from '../styles';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface RepayFormProps {
  asset: Asset;
  repay: (amountWei: BigNumber) => Promise<string | undefined>;
  isRepayLoading: boolean;
  includeXvs: boolean;
  limitTokens: string;
}

export const RepayForm: React.FC<RepayFormProps> = ({
  asset,
  repay,
  isRepayLoading,
  includeXvs,
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
        value: asset.walletBalance,
        token: asset.vToken.underlyingToken,
      }),
    [asset.walletBalance, asset.vToken.underlyingToken],
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
            hypotheticalBorrowAmountTokens={-values.amount}
            asset={asset}
            includeXvs={includeXvs}
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
  includeXvs: boolean;
  onClose: () => void;
}

const Repay: React.FC<RepayProps> = ({ vToken, onClose, includeXvs }) => {
  const { t } = useTranslation();
  const { account } = React.useContext(AuthContext);

  const {
    data: { asset },
  } = useGetUserAsset({ token: vToken.underlyingToken });

  const limitTokens = React.useMemo(
    () =>
      asset ? BigNumber.min(asset.userBorrowBalanceTokens, asset.walletBalance) : new BigNumber(0),
    [asset?.userBorrowBalanceTokens, asset?.walletBalance],
  );

  const { mutateAsync: repay, isLoading: isRepayLoading } = useRepay({
    vToken,
  });

  const handleRepay: RepayFormProps['repay'] = async amountWei => {
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    const isRepayingFullLoan = amountWei.eq(
      convertTokensToWei({
        value: asset!.userBorrowBalanceTokens,
        token: asset!.vToken.underlyingToken,
      }),
    );

    const res = await repay({
      amountWei,
      accountAddress: account.address,
      isRepayingFullLoan,
    });

    // Close modal on success
    onClose();

    return res.transactionHash;
  };

  return (
    <ConnectWallet message={t('borrowRepayModal.repay.connectWalletMessage')}>
      {asset ? (
        <EnableToken
          token={vToken.underlyingToken}
          spenderAddress={vToken.address}
          title={t('borrowRepayModal.repay.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          tokenInfo={[
            {
              label: t('borrowRepayModal.repay.enableToken.borrowInfo'),
              iconSrc: vToken.underlyingToken,
              children: formatToReadablePercentage(asset.borrowApyPercentage),
            },
            {
              label: t('borrowRepayModal.repay.enableToken.distributionInfo'),
              iconSrc: TOKENS.xvs,
              children: formatToReadablePercentage(asset.xvsBorrowApy),
            },
          ]}
        >
          <RepayForm
            asset={asset}
            repay={handleRepay}
            includeXvs={includeXvs}
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

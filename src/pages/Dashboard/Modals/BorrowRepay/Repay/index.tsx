/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  LabeledInlineContent,
  NoticeWarning,
  PrimaryButton,
  TertiaryButton,
  TokenTextField,
  toast,
} from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  convertTokensToWei,
  formatToReadablePercentage,
  formatTokensToReadableValue,
  unsafelyGetVToken,
} from 'utilities';

import { useRepayVToken } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { useStyles } from '../../styles';
import AccountData from '../AccountData';
import { useStyles as useRepayStyles } from './styles';
import TEST_IDS from './testIds';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];

export interface RepayFormProps {
  asset: Asset;
  repay: (amountWei: BigNumber) => Promise<string | undefined>;
  isRepayLoading: boolean;
  isXvsEnabled: boolean;
  limitTokens: string;
}

export const RepayForm: React.FC<RepayFormProps> = ({
  asset,
  repay,
  isRepayLoading,
  isXvsEnabled,
  limitTokens,
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
        .decimalPlaces(asset.token.decimals)
        .toFixed(),
    [asset.borrowBalance.toFixed(), asset.token.decimals],
  );

  const readableTokenBorrowBalance = React.useMemo(
    () =>
      formatTokensToReadableValue({
        value: asset.borrowBalance,
        token: asset.token,
      }),
    [asset.borrowBalance.toFixed(), asset.token],
  );

  const readableTokenWalletBalance = React.useMemo(
    () =>
      formatTokensToReadableValue({
        value: asset.walletBalance,
        token: asset.token,
      }),
    [asset.walletBalance.toFixed(), asset.token],
  );

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const formattedAmountTokens = new BigNumber(amountTokens);

    const amountWei = convertTokensToWei({
      value: formattedAmountTokens,
      token: asset.token,
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
            token: asset.token,
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
    [asset.token, asset.borrowBalance.toFixed()],
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
              token={asset.token}
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
  asset: Asset;
  isXvsEnabled: boolean;
  onClose: () => void;
}

const Repay: React.FC<RepayProps> = ({ asset, onClose, isXvsEnabled }) => {
  const { t } = useTranslation();
  const { account } = React.useContext(AuthContext);

  const vBepTokenContractAddress = unsafelyGetVToken(asset.token.id).address;

  const limitTokens = React.useMemo(
    () => BigNumber.min(asset.borrowBalance, asset.walletBalance),
    [asset.borrowBalance, asset.walletBalance],
  );

  const { mutateAsync: repay, isLoading: isRepayLoading } = useRepayVToken({
    vTokenId: asset.token.id,
  });

  const handleRepay: RepayFormProps['repay'] = async amountWei => {
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }

    const isRepayingFullLoan = amountWei.eq(
      convertTokensToWei({ value: asset.borrowBalance, token: asset.token }),
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
          token={asset.token}
          spenderAddress={vBepTokenContractAddress}
          title={t('borrowRepayModal.repay.enableToken.title', { symbol: asset.token.symbol })}
          tokenInfo={[
            {
              label: t('borrowRepayModal.repay.enableToken.borrowInfo'),
              iconSrc: asset.token,
              children: formatToReadablePercentage(asset.borrowApy),
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
            isXvsEnabled={isXvsEnabled}
            isRepayLoading={isRepayLoading}
            limitTokens={limitTokens.toFixed()}
          />
        </EnableToken>
      )}
    </ConnectWallet>
  );
};

export default Repay;

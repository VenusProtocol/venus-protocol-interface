/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { Asset } from 'types';
import { AuthContext } from 'context/AuthContext';
import { AmountForm, IAmountFormProps, ErrorCode } from 'containers/AmountForm';
import { formatApy, convertCoinsToWei, formatCoinsToReadableValue } from 'utilities/common';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import toast from 'components/Basic/Toast';
import {
  PrimaryButton,
  TokenTextField,
  ConnectWallet,
  EnableToken,
  LabeledInlineContent,
} from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';
import AccountData from '../AccountData';

export interface IRepayFormProps {
  asset: Asset;
  repay: (amountWei: BigNumber) => Promise<string>;
  isRepayLoading: boolean;
}

export const RepayForm: React.FC<IRepayFormProps> = ({ asset, repay, isRepayLoading }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const limitTokens = asset.borrowBalance.toFixed();
  const readableTokenBorrowBalance = React.useMemo(
    () =>
      formatCoinsToReadableValue({
        value: asset.borrowBalance,
        tokenId: asset.id,
      }),
    [asset.borrowBalance.toFixed(), asset.id],
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

            {/* @TODO: add wallet balance */}
          </div>

          {/* @TODO: add buttons */}

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

  // TODO: use repay VToken mutation
  const isRepayLoading = false;
  const handleRepay: IRepayFormProps['repay'] = async amountWei => {
    if (!account?.address) {
      throw new Error(t('errors.walletNotConnected'));
    }

    console.log('amountWei', amountWei.toFixed());

    // const res = await borrow({
    //   amountWei,
    //   fromAccountAddress: account.address,
    // });

    // Close modal on success
    onClose();

    // return res.transactionHash;
    return 'TODO: return hash';
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

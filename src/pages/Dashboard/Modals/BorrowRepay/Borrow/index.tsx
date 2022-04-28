/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';

import { getVBepToken } from 'utilities';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset, VTokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import { AmountForm, IAmountFormProps, ErrorCode } from 'containers/AmountForm';
import { formatApy, convertCoinsToWei } from 'utilities/common';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import toast from 'components/Basic/Toast';
import { UiError } from 'utilities/errors';
import { useUserMarketInfo, useBorrowVToken } from 'clients/api';
import { PrimaryButton, TokenTextField, Icon, ConnectWallet, EnableToken } from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';
import AccountData from '../AccountData';
import { useStyles as useBorrowStyles } from './styles';

export interface IBorrowFormProps {
  asset: Asset;
  limitTokens: string;
  safeBorrowLimitPercentage: number;
  safeLimitTokens: string;
  borrow: (amountWei: BigNumber) => Promise<string>;
  isBorrowLoading: boolean;
}

export const BorrowForm: React.FC<IBorrowFormProps> = ({
  asset,
  limitTokens,
  safeBorrowLimitPercentage,
  safeLimitTokens,
  borrow,
  isBorrowLoading,
}) => {
  const { t } = useTranslation();

  const sharedStyles = useStyles();
  const borrowStyles = useBorrowStyles();
  const styles = {
    ...sharedStyles,
    ...borrowStyles,
  };

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const onSubmit: IAmountFormProps['onSubmit'] = async amountTokens => {
    const formattedAmountTokens = new BigNumber(amountTokens);

    const amountWei = convertCoinsToWei({
      value: formattedAmountTokens,
      tokenId: asset.id,
    });

    try {
      // Send request to borrow tokens
      const transactionHash = await borrow(amountWei);

      // Display successful transaction modal
      openSuccessfulTransactionModal({
        title: t('borrowRepayModal.borrow.successfulTransactionModal.title'),
        message: t('borrowRepayModal.borrow.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          tokenId: asset.id,
        },
        transactionHash,
      });
    } catch (error) {
      toast.error(error as UiError);
    }
  };

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
      {({ values, setFieldValue, handleBlur, dirty, isValid, errors }) => (
        <>
          <div css={[styles.getRow({ isLast: true })]}>
            <TokenTextField
              name="amount"
              tokenId={asset.id}
              value={values.amount}
              onChange={amount => setFieldValue('amount', amount, true)}
              disabled={isBorrowLoading}
              onBlur={handleBlur}
              rightMaxButton={{
                label: t('borrowRepayModal.borrow.rightMaxButtonLabel', {
                  limitPercentage: safeBorrowLimitPercentage,
                }),
                valueOnClick: safeLimitTokens,
              }}
              data-testid="token-text-field"
              // Only display error state if amount is higher than borrow limit
              hasError={errors.amount === ErrorCode.HIGHER_THAN_MAX}
            />

            {+values.amount > +safeLimitTokens && (
              <div css={styles.liquidationWarning}>
                <Icon name="info" css={styles.liquidationWarningIcon} />

                <Typography variant="small2" css={styles.whiteLabel}>
                  {t('borrowRepayModal.borrow.highAmountWarning')}
                </Typography>
              </div>
            )}
          </div>

          <AccountData hypotheticalBorrowAmountTokens={+values.amount} asset={asset} />

          <PrimaryButton
            type="submit"
            loading={isBorrowLoading}
            disabled={!isValid || !dirty || isBorrowLoading}
            fullWidth
          >
            {dirty && isValid
              ? t('borrowRepayModal.borrow.submitButton')
              : t('borrowRepayModal.borrow.submitButtonDisabled')}
          </PrimaryButton>
        </>
      )}
    </AmountForm>
  );
};

export interface IBorrowProps {
  asset: Asset;
  onClose: () => void;
}

const Borrow: React.FC<IBorrowProps> = ({ asset, onClose }) => {
  const { t } = useTranslation();
  const { account } = React.useContext(AuthContext);

  const { userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    accountAddress: account?.address,
  });

  const { mutateAsync: borrow, isLoading: isBorrowLoading } = useBorrowVToken({
    vTokenId: asset.id as VTokenId,
  });

  // Convert dollar values to cents
  const totalBorrowBalanceCents = userTotalBorrowBalance.multipliedBy(100);
  const borrowLimitCents = userTotalBorrowLimit.multipliedBy(100);

  const handleBorrow: IBorrowFormProps['borrow'] = async amountWei => {
    if (!account?.address) {
      throw new UiError(t('errors.walletNotConnected'));
    }

    const res = await borrow({
      amountWei,
      fromAccountAddress: account.address,
    });

    // Close modal on success
    onClose();

    return res.transactionHash;
  };

  // Calculate maximum and safe maximum amount of coins user can borrow
  const [limitTokens, safeLimitTokens] = React.useMemo(() => {
    const safeBorrowLimitCents = borrowLimitCents.multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE / 100);
    const marginWithBorrowLimitCents = borrowLimitCents.minus(totalBorrowBalanceCents);
    const marginWithSafeBorrowLimitCents = safeBorrowLimitCents.minus(totalBorrowBalanceCents);

    const tokenDecimals = getVBepToken(asset.id as VTokenId).decimals;
    const formatValue = (value: BigNumber) => value.toFixed(tokenDecimals, BigNumber.ROUND_DOWN);

    const maxCoins = marginWithBorrowLimitCents
      // Convert cents to dollars
      .dividedBy(100)
      // Convert dollars to coins
      .dividedBy(asset.tokenPrice);

    const safeMaxCoins = marginWithSafeBorrowLimitCents
      // Convert cents to dollars
      .dividedBy(100)
      // Convert dollars to coins
      .dividedBy(asset.tokenPrice);

    return [formatValue(maxCoins), formatValue(safeMaxCoins)];
  }, [asset.id, asset.tokenPrice, borrowLimitCents.toFixed(), totalBorrowBalanceCents.toFixed()]);

  return (
    <ConnectWallet message={t('borrowRepayModal.borrow.connectWalletMessage')}>
      {asset && (
        <EnableToken
          symbol={asset.id}
          title={t('borrowRepayModal.borrow.enableToken.title', { symbol: asset.symbol })}
          tokenInfo={[
            {
              label: t('borrowRepayModal.borrow.enableToken.borrowInfo'),
              iconName: asset.id,
              children: formatApy(asset.borrowApy),
            },
            {
              label: t('borrowRepayModal.borrow.enableToken.distributionInfo'),
              iconName: 'xvs',
              children: formatApy(asset.xvsBorrowApy),
            },
          ]}
          isEnabled={asset.isEnabled}
          vtokenAddress={asset.vtokenAddress}
        >
          <BorrowForm
            asset={asset}
            limitTokens={limitTokens}
            safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
            safeLimitTokens={safeLimitTokens}
            borrow={handleBorrow}
            isBorrowLoading={isBorrowLoading}
          />
        </EnableToken>
      )}
    </ConnectWallet>
  );
};

export default Borrow;

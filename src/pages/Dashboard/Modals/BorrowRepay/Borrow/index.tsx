/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset } from 'types';
import { AuthContext } from 'context/AuthContext';
import { AmountForm, IAmountFormProps, ErrorCode } from 'containers/AmountForm';
import { formatApy, convertCoinsToWei } from 'utilities/common';
import calculateDailyEarningsCentsUtil from 'utilities/calculateDailyEarningsCents';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { calculateYearlyEarningsForAssets } from 'utilities/calculateYearlyEarnings';
import toast from 'components/Basic/Toast';
import { useUserMarketInfo } from 'clients/api';
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
  totalBorrowBalanceCents: BigNumber;
  borrowLimitCents: BigNumber;
  borrow: (amountWei: BigNumber) => Promise<string>;
  isBorrowLoading: boolean;
  calculateDailyEarningsCents: (tokenAmount: BigNumber) => BigNumber;
}

export const BorrowForm: React.FC<IBorrowFormProps> = ({
  asset,
  limitTokens,
  safeBorrowLimitPercentage,
  safeLimitTokens,
  totalBorrowBalanceCents,
  borrowLimitCents,
  borrow,
  isBorrowLoading,
  calculateDailyEarningsCents,
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
      // Send request to repay VAI
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
      toast.error({ title: (error as Error).message });
    }
  };

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
      {({ values, setFieldValue, handleBlur, dirty, isValid, errors }) => (
        <>
          <div css={styles.getRow({ isLast: true })}>
            <TokenTextField
              name="amount"
              tokenId={asset.id}
              value={values.amount}
              onChange={amount => setFieldValue('amount', amount, true)}
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

          <AccountData
            amount={values.amount}
            asset={asset}
            totalBorrowBalanceCents={totalBorrowBalanceCents}
            borrowLimitCents={borrowLimitCents}
            calculateDailyEarningsCents={calculateDailyEarningsCents}
          />

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

  const { assets, userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    accountAddress: account?.address,
  });

  // Convert dollar values to cents
  const totalBorrowBalanceCents = userTotalBorrowBalance.multipliedBy(100);
  const borrowLimitCents = userTotalBorrowLimit.multipliedBy(100);

  const calculateDailyEarningsCents: IBorrowFormProps['calculateDailyEarningsCents'] =
    tokenAmount => {
      const updatedAssets = assets.map(assetData => ({
        ...assetData,
        borrowBalance:
          assetData.id === asset.id
            ? assetData.borrowBalance.plus(tokenAmount)
            : assetData.borrowBalance,
      }));

      const { yearlyEarningsCents } = calculateYearlyEarningsForAssets({
        assets: updatedAssets,
        borrowBalanceCents: totalBorrowBalanceCents,
        isXvsEnabled: true,
      });

      return yearlyEarningsCents
        ? calculateDailyEarningsCentsUtil(yearlyEarningsCents)
        : new BigNumber(0);
    };

  const handleBorrow = async () => {
    if (!account?.address) {
      throw new Error(t('borrowRepayModal.walletNotConnectedError'));
    }

    // Close modal
    onClose();

    // const res = await claimXvsReward({
    //   fromAccountAddress: account.address,
    // });

    // return res.transactionHash;

    return '1273986';
  };

  // Calculate maximum and safe maximum amount of coins user can borrow
  const [limitTokens, safeLimitTokens] = React.useMemo(() => {
    const safeBorrowLimitCents = borrowLimitCents.multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE / 100);
    const marginWithBorrowLimitCents = borrowLimitCents.minus(totalBorrowBalanceCents);
    const marginWithSafeBorrowLimitCents = safeBorrowLimitCents.minus(totalBorrowBalanceCents);

    const tokenDecimals = getToken(asset.id).decimals;
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
            totalBorrowBalanceCents={totalBorrowBalanceCents}
            borrowLimitCents={borrowLimitCents}
            safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
            safeLimitTokens={safeLimitTokens}
            borrow={handleBorrow}
            isBorrowLoading={false}
            calculateDailyEarningsCents={calculateDailyEarningsCents}
          />
        </EnableToken>
      )}
    </ConnectWallet>
  );
};

export default Borrow;

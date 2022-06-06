/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { getToken } from 'utilities';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'config';
import { Asset, VTokenId } from 'types';
import { AuthContext } from 'context/AuthContext';
import { AmountForm, IAmountFormProps, ErrorCode } from 'containers/AmountForm';
import {
  formatToReadablePercentage,
  formatCoinsToReadableValue,
  convertCoinsToWei,
} from 'utilities/common';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { VError, formatVErrorToReadableString } from 'errors';
import { useGetUserMarketInfo, useBorrowVToken } from 'clients/api';
import {
  toast,
  FormikSubmitButton,
  FormikTokenTextField,
  ConnectWallet,
  EnableToken,
  NoticeWarning,
} from 'components';
import { useTranslation } from 'translation';
import { useStyles } from '../../styles';
import AccountData from '../AccountData';

export interface IBorrowFormProps {
  asset: Asset;
  limitTokens: string;
  safeBorrowLimitPercentage: number;
  safeLimitTokens: string;
  borrow: (amountWei: BigNumber) => Promise<string | undefined>;
  isBorrowLoading: boolean;
  isXvsEnabled: boolean;
}

export const BorrowForm: React.FC<IBorrowFormProps> = ({
  asset,
  limitTokens,
  safeBorrowLimitPercentage,
  safeLimitTokens,
  borrow,
  isXvsEnabled,
  isBorrowLoading,
}) => {
  const { t, Trans } = useTranslation();

  const sharedStyles = useStyles();

  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const readableTokenBorrowableAmount = React.useMemo(
    () =>
      formatCoinsToReadableValue({
        value: new BigNumber(limitTokens),
        tokenId: asset.id,
      }),
    [limitTokens],
  );

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
      if (transactionHash) {
        openSuccessfulTransactionModal({
          title: t('borrowRepayModal.borrow.successfulTransactionModal.title'),
          content: t('borrowRepayModal.borrow.successfulTransactionModal.message'),
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

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
      {({ values, dirty, isValid, errors }) => (
        <>
          <div css={[sharedStyles.getRow({ isLast: true })]}>
            <FormikTokenTextField
              name="amount"
              tokenId={asset.id}
              disabled={isBorrowLoading}
              rightMaxButton={{
                label: t('borrowRepayModal.borrow.rightMaxButtonLabel', {
                  limitPercentage: safeBorrowLimitPercentage,
                }),
                valueOnClick: safeLimitTokens,
              }}
              data-testid="token-text-field"
              // Only display error state if amount is higher than borrow limit
              hasError={errors.amount === ErrorCode.HIGHER_THAN_MAX}
              description={
                <Trans
                  i18nKey="borrowRepayModal.borrow.borrowableAmount"
                  components={{
                    White: <span css={sharedStyles.whiteLabel} />,
                  }}
                  values={{ amount: readableTokenBorrowableAmount }}
                />
              }
            />

            {+values.amount > +safeLimitTokens && (
              <NoticeWarning
                css={sharedStyles.notice}
                description={t('borrowRepayModal.borrow.highAmountWarning')}
              />
            )}
          </div>

          <AccountData
            hypotheticalBorrowAmountTokens={+values.amount}
            asset={asset}
            isXvsEnabled={isXvsEnabled}
          />

          <FormikSubmitButton
            loading={isBorrowLoading}
            disabled={!isValid || !dirty || isBorrowLoading}
            fullWidth
            enabledLabel={t('borrowRepayModal.borrow.submitButton')}
            disabledLabel={t('borrowRepayModal.borrow.submitButtonDisabled')}
          />
        </>
      )}
    </AmountForm>
  );
};

export interface IBorrowProps {
  asset: Asset;
  isXvsEnabled: boolean;
  onClose: () => void;
}

const Borrow: React.FC<IBorrowProps> = ({ asset, onClose, isXvsEnabled }) => {
  const { t } = useTranslation();
  const { account } = React.useContext(AuthContext);

  // TODO: handle loading state (see https://app.clickup.com/t/2d4rcee)
  const {
    data: { userTotalBorrowBalanceCents, userTotalBorrowLimitCents },
  } = useGetUserMarketInfo({
    accountAddress: account?.address,
  });

  const { mutateAsync: borrow, isLoading: isBorrowLoading } = useBorrowVToken({
    vTokenId: asset.id as VTokenId,
  });

  const handleBorrow: IBorrowFormProps['borrow'] = async amountWei => {
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
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
    // Return 0 values if borrow limit has been reached
    if (userTotalBorrowBalanceCents.isGreaterThanOrEqualTo(userTotalBorrowLimitCents)) {
      return ['0', '0'];
    }

    const marginWithBorrowLimitDollars = userTotalBorrowLimitCents
      .minus(userTotalBorrowBalanceCents)
      // Convert cents to dollars
      .dividedBy(100);
    const maxCoins = BigNumber.minimum(asset.liquidity, marginWithBorrowLimitDollars)
      // Convert dollars to coins
      .dividedBy(asset.tokenPrice);

    const safeBorrowLimitCents = userTotalBorrowLimitCents.multipliedBy(
      SAFE_BORROW_LIMIT_PERCENTAGE / 100,
    );
    const marginWithSafeBorrowLimitDollars = safeBorrowLimitCents
      .minus(userTotalBorrowBalanceCents)
      // Convert cents to dollars
      .dividedBy(100);

    const safeMaxCoins = userTotalBorrowBalanceCents.isLessThan(safeBorrowLimitCents)
      ? // Convert dollars to coins
        marginWithSafeBorrowLimitDollars.dividedBy(asset.tokenPrice)
      : new BigNumber(0);

    const tokenDecimals = getToken(asset.id as VTokenId).decimals;
    const formatValue = (value: BigNumber) =>
      value.dp(tokenDecimals, BigNumber.ROUND_DOWN).toFixed();

    return [formatValue(maxCoins), formatValue(safeMaxCoins)];
  }, [
    asset.id,
    asset.tokenPrice,
    asset.liquidity,
    userTotalBorrowLimitCents.toFixed(),
    userTotalBorrowBalanceCents.toFixed(),
  ]);

  return (
    <ConnectWallet message={t('borrowRepayModal.borrow.connectWalletMessage')}>
      {asset && (
        <EnableToken
          vTokenId={asset.id}
          title={t('borrowRepayModal.borrow.enableToken.title', { symbol: asset.symbol })}
          tokenInfo={[
            {
              label: t('borrowRepayModal.borrow.enableToken.borrowInfo'),
              iconName: asset.id,
              children: formatToReadablePercentage(asset.borrowApy),
            },
            {
              label: t('borrowRepayModal.borrow.enableToken.distributionInfo'),
              iconName: 'xvs',
              children: formatToReadablePercentage(asset.xvsBorrowApy),
            },
          ]}
        >
          <BorrowForm
            asset={asset}
            isXvsEnabled={isXvsEnabled}
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

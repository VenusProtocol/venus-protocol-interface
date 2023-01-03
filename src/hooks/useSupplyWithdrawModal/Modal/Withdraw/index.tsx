/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  LabeledInlineContentProps,
  ModalProps,
  Spinner,
} from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { Asset, VToken } from 'types';
import { convertTokensToWei, formatToReadablePercentage } from 'utilities';

import { useGetAsset, useGetMainAssets, useRedeem, useRedeemUnderlying } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { useStyles } from '../styles';
import WithdrawForm from './form';

export interface WithdrawProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
}

export interface WithdrawUiProps extends Omit<WithdrawProps, 'token' | 'vToken'> {
  userTotalBorrowBalanceCents: BigNumber;
  userTotalBorrowLimitCents: BigNumber;
  onSubmit: AmountFormProps['onSubmit'];
  isLoading: boolean;
  assets: Asset[];
  className?: string;
  asset?: Asset;
}

export const WithdrawUi: React.FC<WithdrawUiProps> = ({
  className,
  asset,
  assets,
  userTotalBorrowBalanceCents,
  userTotalBorrowLimitCents,
  onSubmit,
  isLoading,
}) => {
  const styles = useStyles();

  const { t } = useTranslation();

  const tokenInfo: LabeledInlineContentProps[] = asset
    ? [
        {
          label: t('supplyWithdraw.supplyApy'),
          iconSrc: asset.vToken.underlyingToken,
          children: formatToReadablePercentage(asset.supplyApyPercentage),
        },
        {
          label: t('supplyWithdraw.distributionApy'),
          iconSrc: TOKENS.xvs,
          children: formatToReadablePercentage(asset.xvsSupplyApy),
        },
      ]
    : [];

  if (!asset) {
    return <></>;
  }

  const maxInput = React.useMemo(() => {
    if (!asset) {
      return new BigNumber(0);
    }

    let maxInputTokens;

    // If asset isn't used as collateral user can withdraw the entire supply
    // balance without affecting their borrow limit
    if (!asset.isCollateralOfUser) {
      maxInputTokens = asset.userSupplyBalanceTokens;
    } else {
      // Calculate how much token user can withdraw before they risk getting
      // liquidated (if their borrow balance goes above their borrow limit)

      // Return 0 if borrow limit has already been reached
      if (userTotalBorrowBalanceCents.isGreaterThanOrEqualTo(userTotalBorrowLimitCents)) {
        return new BigNumber(0);
      }

      const marginWithBorrowLimitDollars = userTotalBorrowLimitCents
        .minus(userTotalBorrowBalanceCents)
        .dividedBy(100);

      const collateralAmountPerTokenDollars = asset.tokenPriceDollars.multipliedBy(
        asset.collateralFactor,
      );
      const maxTokensBeforeLiquidation = marginWithBorrowLimitDollars
        .dividedBy(collateralAmountPerTokenDollars)
        .dp(asset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN);

      maxInputTokens = BigNumber.minimum(maxTokensBeforeLiquidation, asset.userSupplyBalanceTokens);
    }

    return maxInputTokens;
  }, [asset]);

  return (
    <div className={className} css={styles.container}>
      <ConnectWallet message={t('supplyWithdraw.connectWalletToWithdraw')}>
        {asset ? (
          <EnableToken
            token={asset.vToken.underlyingToken}
            spenderAddress={asset.vToken.address}
            title={t('supplyWithdraw.enableToWithdraw', {
              symbol: asset?.vToken.underlyingToken.symbol,
            })}
            tokenInfo={tokenInfo}
          >
            <WithdrawForm
              key="form-withdraw"
              asset={asset}
              assets={assets}
              tokenInfo={tokenInfo}
              userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
              userTotalBorrowLimitCents={userTotalBorrowLimitCents}
              onSubmit={onSubmit}
              inputLabel={t('supplyWithdraw.withdrawableAmount')}
              enabledButtonKey={t('supplyWithdraw.withdraw')}
              disabledButtonKey={t('supplyWithdraw.enterValidAmountWithdraw')}
              maxInput={maxInput}
              calculateNewBalance={(initial: BigNumber, amount: BigNumber) => initial.minus(amount)}
              isTransactionLoading={isLoading}
            />
          </EnableToken>
        ) : (
          <Spinner />
        )}
      </ConnectWallet>
    </div>
  );
};

const WithdrawModal: React.FC<WithdrawProps> = ({ vToken, onClose }) => {
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);

  const { data: assetData } = useGetAsset({ vToken });

  const { asset } = assetData || { asset: undefined };

  const { data: mainAssetsData } = useGetMainAssets({
    accountAddress,
  });

  const { assets, userTotalBorrowBalanceCents, userTotalBorrowLimitCents } = mainAssetsData || {
    assets: [],
    userTotalBorrowBalanceCents: new BigNumber(0),
    userTotalBorrowLimitCents: new BigNumber(0),
  };

  const { t } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const { mutateAsync: redeem, isLoading: isRedeemLoading } = useRedeem({
    vToken,
    accountAddress,
  });

  const { mutateAsync: redeemUnderlying, isLoading: isRedeemUnderlyingLoading } =
    useRedeemUnderlying({
      vToken,
      accountAddress,
    });

  const isWithdrawLoading = isRedeemLoading || isRedeemUnderlyingLoading;

  const onSubmit: AmountFormProps['onSubmit'] = async value => {
    if (!asset) {
      return;
    }

    const amount = new BigNumber(value);
    const amountEqualsSupplyBalance = amount.eq(asset.userSupplyBalanceTokens);
    let transactionHash;

    if (amountEqualsSupplyBalance && asset.userSupplyBalanceTokens) {
      const userSupplyBalanceWei = convertTokensToWei({
        value: asset.userSupplyBalanceTokens,
        token: asset.vToken.underlyingToken,
      });
      const res = await redeem({ amountWei: userSupplyBalanceWei });

      ({ transactionHash } = res);
      // Successful transaction modal will display
    } else {
      const withdrawAmountWei = convertTokensToWei({
        value: new BigNumber(value),
        token: asset.vToken.underlyingToken,
      });

      const res = await redeemUnderlying({
        amountWei: withdrawAmountWei,
      });

      ({ transactionHash } = res);
    }

    onClose();

    if (transactionHash) {
      openSuccessfulTransactionModal({
        title: t('supplyWithdraw.successfulWithdrawTransactionModal.title'),
        content: t('supplyWithdraw.successfulWithdrawTransactionModal.message'),
        amount: {
          valueWei: convertTokensToWei({ value: amount, token: vToken.underlyingToken }),
          token: vToken.underlyingToken,
        },
        transactionHash,
      });
    }
  };
  return (
    <WithdrawUi
      onClose={onClose}
      asset={asset}
      assets={assets}
      userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      onSubmit={onSubmit}
      isLoading={isWithdrawLoading}
    />
  );
};

export default WithdrawModal;

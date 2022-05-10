/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  Tabs,
  Modal,
  IModalProps,
  Token,
  ILabeledInlineContentProps,
  IconName,
} from 'components';
import {
  useRedeem,
  useRedeemUnderlying,
  useGetVTokenBalance,
  useUserMarketInfo,
} from 'clients/api';
import { IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSupply from 'clients/api/mutations/useSupply';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import { useTranslation } from 'translation';
import { Asset, TokenId, VTokenId } from 'types';
import { formatToReadablePercentage, convertCoinsToWei } from 'utilities/common';
import SupplyWithdrawForm from './SupplyWithdrawForm';
import { useStyles } from '../styles';

export interface ISupplyWithdrawUiProps {
  className?: string;
  onClose: IModalProps['handleClose'];
  asset: Asset;
  assets: Asset[];
  isXvsEnabled: boolean;
}

export interface ISupplyWithdrawProps {
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowLimit: BigNumber;
  onSubmitSupply: IAmountFormProps['onSubmit'];
  onSubmitWithdraw: IAmountFormProps['onSubmit'];
  isSupplyLoading: boolean;
  isWithdrawLoading: boolean;
}

/**
 * The fade effect on this component results in that it is still rendered after the asset has been set to undefined
 * when closing the modal.
 */
export const SupplyWithdrawUi: React.FC<ISupplyWithdrawUiProps & ISupplyWithdrawProps> = ({
  className,
  onClose,
  asset,
  assets,
  userTotalBorrowBalance,
  userTotalBorrowLimit,
  isXvsEnabled,
  onSubmitSupply,
  onSubmitWithdraw,
  isSupplyLoading,
  isWithdrawLoading,
}) => {
  const styles = useStyles();

  const { id: assetId, isEnabled, symbol } = asset || {};
  const { t } = useTranslation();

  const tokenInfo: ILabeledInlineContentProps[] = asset
    ? [
        {
          label: t('supplyWithdraw.supplyApy'),
          iconName: assetId as IconName,
          children: formatToReadablePercentage(asset.supplyApy),
        },
        {
          label: t('supplyWithdraw.distributionApy'),
          iconName: 'xvs' as IconName,
          children: formatToReadablePercentage(asset.xvsSupplyApy),
        },
      ]
    : [];

  const renderTabContent = ({
    type,
    message,
    title,
    inputLabel,
    enabledButtonKey,
    disabledButtonKey,
    calculateNewBalance,
    isTransactionLoading,
    onSubmit,
  }: {
    type: 'supply' | 'withdraw';
    message: string;
    title: string;
    inputLabel: string;
    enabledButtonKey: string;
    disabledButtonKey: string;
    calculateNewBalance: (initial: BigNumber, amount: BigNumber) => BigNumber;
    isTransactionLoading: boolean;
    onSubmit: IAmountFormProps['onSubmit'];
  }) => {
    const maxInput = React.useMemo(() => {
      let maxInputTokens = asset.walletBalance;

      // If asset isn't used as collateral user can withdraw the entire supply
      // balance without affecting their borrow limit
      if (type === 'withdraw' && !asset.collateral) {
        maxInputTokens = asset.supplyBalance;
      } else if (type === 'withdraw') {
        // Calculate how much token user can withdraw before they risk getting
        // liquidated (if their borrow balance goes above their borrow limit)

        // Return 0 if borrow limit has already been reached
        if (userTotalBorrowBalance.isGreaterThanOrEqualTo(userTotalBorrowLimit)) {
          return new BigNumber(0);
        }

        const marginWithBorrowLimitDollars = userTotalBorrowLimit.minus(userTotalBorrowBalance);

        const collateralAmountPerTokenDollars = asset.tokenPrice.multipliedBy(
          asset.collateralFactor,
        );
        const maxTokensBeforeLiquidation = marginWithBorrowLimitDollars
          .dividedBy(collateralAmountPerTokenDollars)
          .dp(asset.decimals, BigNumber.ROUND_DOWN);

        maxInputTokens = BigNumber.minimum(maxTokensBeforeLiquidation, asset.supplyBalance);
      }

      return maxInputTokens;
    }, []);

    return (
      <div className={className} css={styles.container}>
        <ConnectWallet message={message}>
          {asset && (
            <EnableToken
              assetId={asset.id as TokenId}
              title={title}
              tokenInfo={tokenInfo}
              isEnabled={!!isEnabled}
              vtokenAddress={asset.vtokenAddress}
            >
              <SupplyWithdrawForm
                key={`form-${type}`}
                asset={asset}
                assets={assets}
                tokenInfo={tokenInfo}
                userTotalBorrowBalance={userTotalBorrowBalance}
                userTotalBorrowLimit={userTotalBorrowLimit}
                onSubmit={onSubmit}
                inputLabel={inputLabel}
                enabledButtonKey={enabledButtonKey}
                disabledButtonKey={disabledButtonKey}
                maxInput={maxInput}
                calculateNewBalance={calculateNewBalance}
                isTransactionLoading={isTransactionLoading}
                isXvsEnabled={isXvsEnabled}
              />
            </EnableToken>
          )}
        </ConnectWallet>
      </div>
    );
  };

  const tabsContent = [
    {
      title: t('supplyWithdraw.supply'),
      content: renderTabContent({
        type: 'supply',
        message: t('supplyWithdraw.connectWalletToSupply'),
        title: t('supplyWithdraw.enableToSupply', { symbol }),
        inputLabel: t('supplyWithdraw.walletBalance'),
        enabledButtonKey: t('supplyWithdraw.supply'),
        disabledButtonKey: t('supplyWithdraw.enterValidAmountSupply'),
        calculateNewBalance: (initial: BigNumber, amount: BigNumber) => initial.plus(amount),
        isTransactionLoading: isSupplyLoading,
        onSubmit: onSubmitSupply,
      }),
    },
    {
      title: t('supplyWithdraw.withdraw'),
      content: renderTabContent({
        type: 'withdraw',
        message: t('supplyWithdraw.connectWalletToWithdraw'),
        title: t('supplyWithdraw.enableToWithdraw', { symbol }),
        inputLabel: t('supplyWithdraw.withdrawableAmount'),
        enabledButtonKey: t('supplyWithdraw.withdraw'),
        disabledButtonKey: t('supplyWithdraw.enterValidAmountWithdraw'),
        calculateNewBalance: (initial: BigNumber, amount: BigNumber) => initial.minus(amount),
        isTransactionLoading: isWithdrawLoading,
        onSubmit: onSubmitWithdraw,
      }),
    },
  ];

  return (
    <Modal
      isOpened={!!assetId}
      handleClose={onClose}
      title={assetId ? <Token symbol={assetId as TokenId} variant="h4" /> : undefined}
    >
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

const SupplyWithdrawModal: React.FC<ISupplyWithdrawUiProps> = props => {
  const { asset, assets, isXvsEnabled, onClose, ...rest } = props;
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);

  const { t } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    accountAddress,
  });
  const { data: vTokenBalanceWei } = useGetVTokenBalance(
    { account: accountAddress, vTokenId: asset.id as VTokenId },
    { enabled: !!accountAddress },
  );
  const { mutateAsync: supply, isLoading: isSupplyLoading } = useSupply({
    asset,
    account: accountAddress,
  });
  const { mutateAsync: redeem, isLoading: isRedeemLoading } = useRedeem({
    assetId: asset?.id as VTokenId,
    account: accountAddress,
  });
  const { mutateAsync: redeemUnderlying, isLoading: isRedeemUnderlyingLoading } =
    useRedeemUnderlying({
      assetId: asset?.id as VTokenId,
      account: accountAddress,
    });
  const isWithdrawLoading = isRedeemLoading || isRedeemUnderlyingLoading;
  const onSubmitSupply: IAmountFormProps['onSubmit'] = async value => {
    const supplyAmount = new BigNumber(value).times(new BigNumber(10).pow(asset.decimals || 18));
    const res = await supply({
      amountWei: supplyAmount,
    });
    onClose();

    openSuccessfulTransactionModal({
      title: t('supplyWithdraw.successfulSupplyTransactionModal.title'),
      message: t('supplyWithdraw.successfulSupplyTransactionModal.message'),
      amount: {
        valueWei: convertCoinsToWei({ value: new BigNumber(value), tokenId: asset.id }),
        tokenId: asset.id,
      },
      transactionHash: res.transactionHash,
    });
  };

  const onSubmitWithdraw: IAmountFormProps['onSubmit'] = async value => {
    const amount = new BigNumber(value);
    const amountEqualsSupplyBalance = amount.eq(asset.supplyBalance);
    let transactionHash;
    if (amountEqualsSupplyBalance && vTokenBalanceWei) {
      const res = await redeem({ amountWei: new BigNumber(vTokenBalanceWei) });
      ({ transactionHash } = res);
      // Display successful transaction modal
    } else {
      const withdrawAmount = amount.times(new BigNumber(10).pow(asset.decimals)).integerValue();
      const res = await redeemUnderlying({
        amountWei: withdrawAmount,
      });
      ({ transactionHash } = res);
    }
    onClose();
    if (transactionHash) {
      openSuccessfulTransactionModal({
        title: t('supplyWithdraw.successfulWithdrawTransactionModal.title'),
        message: t('supplyWithdraw.successfulWithdrawTransactionModal.message'),
        amount: {
          valueWei: convertCoinsToWei({ value: amount, tokenId: asset.id }),
          tokenId: asset.id,
        },
        transactionHash,
      });
    }
  };
  return (
    <SupplyWithdrawUi
      {...rest}
      onClose={onClose}
      asset={asset}
      userTotalBorrowBalance={userTotalBorrowBalance}
      userTotalBorrowLimit={userTotalBorrowLimit}
      onSubmitSupply={onSubmitSupply}
      onSubmitWithdraw={onSubmitWithdraw}
      isSupplyLoading={isSupplyLoading}
      isWithdrawLoading={isWithdrawLoading}
      isXvsEnabled={isXvsEnabled}
      assets={assets}
    />
  );
};

export default SupplyWithdrawModal;

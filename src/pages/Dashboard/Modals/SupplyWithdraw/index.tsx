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

  const calculateNewSupplyAmount = (initial: BigNumber, amount: BigNumber) => initial.plus(amount);
  const calculateNewBorrowAmount = (initial: BigNumber, amount: BigNumber) => initial.minus(amount);

  const renderTabContent = ({
    message,
    title,
    key,
    inputLabel,
    enabledButtonKey,
    disabledButtonKey,
    maxInputKey,
    calculateNewBalance,
    isTransactionLoading,
    onSubmit,
  }: {
    message: string;
    title: string;
    key: string;
    inputLabel: string;
    enabledButtonKey: string;
    disabledButtonKey: string;
    maxInputKey: 'walletBalance' | 'supplyBalance';
    calculateNewBalance: (initial: BigNumber, amount: BigNumber) => BigNumber;
    isTransactionLoading: boolean;
    onSubmit: IAmountFormProps['onSubmit'];
  }) => (
    <div className={className} css={styles.container}>
      <ConnectWallet message={message}>
        {asset && (
          <EnableToken
            assetId={asset.id as TokenId}
            symbol={asset.symbol}
            title={title}
            tokenInfo={tokenInfo}
            isEnabled={!!isEnabled}
            vtokenAddress={asset.vtokenAddress}
          >
            <SupplyWithdrawForm
              key={key}
              asset={asset}
              assets={assets}
              tokenInfo={tokenInfo}
              userTotalBorrowBalance={userTotalBorrowBalance}
              userTotalBorrowLimit={userTotalBorrowLimit}
              onSubmit={onSubmit}
              inputLabel={inputLabel}
              enabledButtonKey={enabledButtonKey}
              disabledButtonKey={disabledButtonKey}
              maxInput={asset[maxInputKey]}
              calculateNewBalance={calculateNewBalance}
              isTransactionLoading={isTransactionLoading}
              isXvsEnabled={isXvsEnabled}
            />
          </EnableToken>
        )}
      </ConnectWallet>
    </div>
  );

  const tabsContent = [
    {
      title: t('supplyWithdraw.supply'),
      content: renderTabContent({
        message: t('supplyWithdraw.connectWalletToSupply'),
        title: t('supplyWithdraw.enableToSupply', { symbol }),
        key: 'supply',
        inputLabel: t('supplyWithdraw.walletBalance'),
        enabledButtonKey: t('supplyWithdraw.supply'),
        disabledButtonKey: t('supplyWithdraw.enterValidAmountSupply'),
        maxInputKey: 'walletBalance',
        calculateNewBalance: calculateNewSupplyAmount,
        isTransactionLoading: isSupplyLoading,
        onSubmit: onSubmitSupply,
      }),
    },
    {
      title: t('supplyWithdraw.withdraw'),
      content: renderTabContent({
        message: t('supplyWithdraw.connectWalletToWithdraw'),
        title: t('supplyWithdraw.enableToWithdraw', { symbol }),
        key: 'withdraw',
        inputLabel: t('supplyWithdraw.withdrawableAmount'),
        enabledButtonKey: t('supplyWithdraw.withdraw'),
        disabledButtonKey: t('supplyWithdraw.enterValidAmountWithdraw'),
        maxInputKey: 'supplyBalance',
        calculateNewBalance: calculateNewBorrowAmount,
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
  const { data: vTokenBalance } = useGetVTokenBalance(
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
    const supplyAmount = new BigNumber(value)
      .times(new BigNumber(10).pow(asset.decimals || 18))
      .toString(10);
    const res = await supply({
      amount: supplyAmount,
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
    let withdrawlValue;
    if (amountEqualsSupplyBalance && vTokenBalance) {
      const res = await redeem({ amount: vTokenBalance });
      ({ transactionHash } = res);
      withdrawlValue = new BigNumber(vTokenBalance);
      // Display successful transaction modal
    } else {
      const withdrawlAmount = amount
        .times(new BigNumber(10).pow(asset.decimals))
        .integerValue()
        .toString(10);
      const res = await redeemUnderlying({
        amount: withdrawlAmount,
      });
      ({ transactionHash } = res);
      withdrawlValue = new BigNumber(withdrawlAmount);
    }
    onClose();
    if (withdrawlValue && transactionHash) {
      openSuccessfulTransactionModal({
        title: t('supplyWithdraw.successfulWithdrawTransactionModal.title'),
        message: t('supplyWithdraw.successfulWithdrawTransactionModal.message'),
        amount: {
          valueWei: convertCoinsToWei({ value: withdrawlValue, tokenId: asset.id }),
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

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
import toast from 'components/Basic/Toast';
import {
  useRedeem,
  useRedeemUnderlying,
  useGetVTokenBalance,
  useUserMarketInfo,
} from 'clients/api';
import { IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSupply from 'clients/api/mutations/useSupply';
import { useTranslation } from 'translation';
import { Asset, TokenId, VTokenId } from 'types';
import { formatApy, getBigNumber } from 'utilities/common';
import { calculateYearlyEarningsCents, calculateDailyEarningsCents } from 'utilities';
import SupplyWithdrawForm from './SupplyWithdrawForm';
import { useStyles } from '../styles';

export interface ISupplyWithdrawUiProps {
  className?: string;
  onClose: IModalProps['handleClose'];
  asset: Asset;
}

export interface ISupplyWithdrawProps {
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowLimit: BigNumber;
  dailyEarningsCents: BigNumber;
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
  userTotalBorrowBalance,
  userTotalBorrowLimit,
  dailyEarningsCents,
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
          children: formatApy(asset.supplyApy),
        },
        {
          label: t('supplyWithdraw.distributionApy'),
          iconName: 'xvs' as IconName,
          children: formatApy(asset.xvsSupplyApy),
        },
      ]
    : [];

  const calculateNewSupplyAmount = (amount: BigNumber) => userTotalBorrowLimit.plus(amount);
  const calculateNewBorrowAmount = (amount: BigNumber) => userTotalBorrowLimit.minus(amount);

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
    calculateNewBalance: (amount: BigNumber) => BigNumber;
    isTransactionLoading: boolean;
    onSubmit: IAmountFormProps['onSubmit'];
  }) => (
    <div className={className} css={styles.container}>
      <ConnectWallet message={message}>
        {asset && (
          <EnableToken
            symbol={assetId as TokenId}
            title={title}
            tokenInfo={tokenInfo}
            isEnabled={!!isEnabled}
            vtokenAddress={asset.vtokenAddress}
          >
            <SupplyWithdrawForm
              key={key}
              asset={asset}
              tokenInfo={tokenInfo}
              userTotalBorrowBalance={userTotalBorrowBalance}
              userTotalBorrowLimit={userTotalBorrowLimit}
              dailyEarningsCents={dailyEarningsCents}
              onSubmit={onSubmit}
              inputLabel={inputLabel}
              enabledButtonKey={enabledButtonKey}
              disabledButtonKey={disabledButtonKey}
              maxInput={asset[maxInputKey]}
              calculateNewBalance={calculateNewBalance}
              isTransactionLoading={isTransactionLoading}
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
  const { asset, ...rest } = props;
  const { account } = useContext(AuthContext);
  const { t } = useTranslation();
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    accountAddress: account?.address,
  });
  const { data: vTokenBalance } = useGetVTokenBalance(
    { account: account?.address || '', vTokenId: asset.id as VTokenId },
    { enabled: !!account },
  );
  const { mutate: supply, isLoading: isSupplyLoading } = useSupply(
    { asset, account: account?.address || '' },
    {
      onError: () => {
        toast.error({
          title: t('supplyWithdraw.supplyError.title'),
          description: t('supplyWithdraw.supplyError.description', { symbol: asset.symbol }),
        });
      },
    },
  );

  const { mutate: redeem, isLoading: isRedeemLoading } = useRedeem(
    {
      assetId: asset?.id as VTokenId,
      account: account?.address || '',
    },
    {
      onError: () => {
        toast.error({
          title: t('supplyWithdraw.withdrawError.title'),
          description: t('supplyWithdraw.withdrawError.description', { symbol: asset.symbol }),
        });
      },
    },
  );
  const { mutate: redeemUnderlying, isLoading: isRedeemUnderlyingLoading } = useRedeemUnderlying(
    {
      assetId: asset?.id as VTokenId,
      account: account?.address || '',
    },
    {
      onError: () => {
        toast.error({
          title: t('supplyWithdraw.withdrawError.title'),
          description: t('supplyWithdraw.withdrawError.description', { symbol: asset.symbol }),
        });
      },
    },
  );
  const isWithdrawLoading = isRedeemLoading || isRedeemUnderlyingLoading;
  const onSubmitSupply: IAmountFormProps['onSubmit'] = value => {
    supply({
      amount: getBigNumber(value)
        .times(new BigNumber(10).pow(asset.decimals || 18))
        .toString(10),
    });
  };

  const onSubmitWithdraw: IAmountFormProps['onSubmit'] = value => {
    const amount = getBigNumber(value);
    const amountEqualsSupplyBalance = amount.eq(asset.supplyBalance);
    if (amountEqualsSupplyBalance && vTokenBalance) {
      redeem({ amount: vTokenBalance });
    } else {
      redeemUnderlying({
        amount: amount.times(new BigNumber(10).pow(asset.decimals)).integerValue().toString(10),
      });
    }
  };
  // @TODO: elevate state so it can be shared with borrow and supply markets
  const isXvsEnabled = true;
  const borrowBalanceCents = userTotalBorrowBalance.multipliedBy(100);
  // @TODO: include all assets in calculation of yearly earnings
  const { yearlyEarningsCents } = calculateYearlyEarningsCents({
    asset,
    borrowBalanceCents,
    isXvsEnabled,
  });
  const dailyEarningsCents =
    yearlyEarningsCents && calculateDailyEarningsCents(yearlyEarningsCents);
  return (
    <SupplyWithdrawUi
      {...rest}
      asset={asset}
      userTotalBorrowBalance={userTotalBorrowBalance}
      userTotalBorrowLimit={userTotalBorrowLimit}
      dailyEarningsCents={dailyEarningsCents}
      onSubmitSupply={onSubmitSupply}
      onSubmitWithdraw={onSubmitWithdraw}
      isSupplyLoading={isSupplyLoading}
      isWithdrawLoading={isWithdrawLoading}
    />
  );
};

export default SupplyWithdrawModal;

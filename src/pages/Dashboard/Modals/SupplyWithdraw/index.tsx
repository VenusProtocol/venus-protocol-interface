/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo } from 'react';
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
import { useGetVTokenBalance } from 'clients/api';
import { IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useUserMarketInfo from 'hooks/useUserMarketInfo';
import useWithdraw, { UseWithdrawParams } from 'hooks/useWithdraw';
import useSupply, { UseSupplyParams } from 'hooks/useSupply';
import { useTranslation } from 'translation';
import { Asset, TokenId, VTokenId } from 'types';
import { formatApy, getBigNumber } from 'utilities/common';
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
  dailyEarnings: BigNumber;
  supply: (params: UseSupplyParams) => void;
  redeem: (params: UseWithdrawParams) => void;
  redeemUnderlying: (params: UseWithdrawParams) => void;
  isTransactionLoading: boolean;
  vTokenBalance: string | undefined;
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
  dailyEarnings,
  supply,
  redeem,
  redeemUnderlying,
  isTransactionLoading,
  vTokenBalance,
}) => {
  const styles = useStyles();

  const { id: assetId, isEnabled, symbol, decimals } = asset || {};
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

  const onSubmitSupply: IAmountFormProps['onSubmit'] = value => {
    supply({
      amount: getBigNumber(value)
        .times(new BigNumber(10).pow(decimals || 18))
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
              dailyEarnings={dailyEarnings}
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

  const tabsContent = useMemo(
    () => [
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
          isTransactionLoading,
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
          isTransactionLoading,
          onSubmit: onSubmitWithdraw,
        }),
      },
    ],
    [],
  );

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
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    account: account?.address,
  });
  const { data: vTokenBalance } = useGetVTokenBalance(
    { account: account?.address, assetId: asset.id as VTokenId },
    { enabled: true },
  );
  const { supply, isLoading: isSupplyLoading } = useSupply({ asset, account: account?.address });
  const {
    redeem,
    redeemUnderlying,
    isLoading: isWithdrawLoading,
  } = useWithdraw({ asset, account: account?.address });
  // @TODO - use dailyEarnings util https://app.clickup.com/t/26pg8j3
  return (
    <SupplyWithdrawUi
      {...rest}
      asset={asset}
      userTotalBorrowBalance={userTotalBorrowBalance}
      userTotalBorrowLimit={userTotalBorrowLimit}
      dailyEarnings={new BigNumber('238')}
      supply={supply}
      redeem={redeem}
      redeemUnderlying={redeemUnderlying}
      vTokenBalance={vTokenBalance}
      isTransactionLoading={isSupplyLoading || isWithdrawLoading}
    />
  );
};

export default SupplyWithdrawModal;

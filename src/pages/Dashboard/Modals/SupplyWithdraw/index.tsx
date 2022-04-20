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
import { IAmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useUserMarketInfo from 'hooks/useUserMarketInfo';
import { useTranslation } from 'translation';
import { Asset, TokenId } from 'types';
import { formatApy } from 'utilities/common';
import SupplyWithdrawForm from './SupplyWithdrawForm';
import { useStyles } from '../styles';

export interface ISupplyWithdrawUiProps {
  className?: string;
  onClose: IModalProps['handleClose'];
  asset: Asset | undefined;
  userTotalBorrowBalance: BigNumber;
  userTotalBorrowLimit: BigNumber;
  dailyEarnings: BigNumber;
}

/**
 * The fade effect on this component results in that it is still rendered after the asset has been set to undefined
 * when closing the modal.
 */
export const SupplyWithdrawUi: React.FC<ISupplyWithdrawUiProps> = ({
  className,
  onClose,
  asset,
  userTotalBorrowBalance,
  userTotalBorrowLimit,
  dailyEarnings,
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

  const onSubmit: IAmountFormProps['onSubmit'] = () => {
    // TODO: https://app.clickup.com/t/24quhp4
  };
  const calculateNewSupplyAmount = (amount: BigNumber) => userTotalBorrowLimit.plus(amount);
  const calculateNewBorrowAmount = (amount: BigNumber) => userTotalBorrowLimit.minus(amount);

  return (
    <Modal
      isOpened={!!assetId}
      handleClose={onClose}
      title={assetId ? <Token symbol={assetId as TokenId} variant="h4" /> : undefined}
    >
      <>
        <Tabs
          tabTitles={[t('supplyWithdraw.supply'), t('supplyWithdraw.withdraw')]}
          tabsContent={[
            <div className={className} css={styles.container}>
              <ConnectWallet message={t('supplyWithdraw.connectWalletToSupply')}>
                {asset && (
                  <EnableToken
                    symbol={assetId as TokenId}
                    title={t('supplyWithdraw.enableToSupply', { symbol })}
                    tokenInfo={tokenInfo}
                    isEnabled={!!isEnabled}
                    vtokenAddress={asset.vtokenAddress}
                  >
                    <SupplyWithdrawForm
                      key="supply"
                      asset={asset}
                      tokenInfo={tokenInfo}
                      userTotalBorrowBalance={userTotalBorrowBalance}
                      userTotalBorrowLimit={userTotalBorrowLimit}
                      dailyEarnings={dailyEarnings}
                      onSubmit={onSubmit}
                      inputLabel={t('supplyWithdraw.walletBalance')}
                      enabledButtonKey={t('supplyWithdraw.supply')}
                      disabledButtonKey={t('supplyWithdraw.enterValidAmountSupply')}
                      maxInput={asset.walletBalance}
                      calculateNewBalance={calculateNewSupplyAmount}
                    />
                  </EnableToken>
                )}
              </ConnectWallet>
            </div>,
            <div className={className} css={styles.container}>
              <ConnectWallet message={t('supplyWithdraw.connectWalletToWithdraw')}>
                {asset && (
                  <EnableToken
                    symbol={assetId as TokenId}
                    title={t('supplyWithdraw.enableToWithdraw', { symbol })}
                    tokenInfo={tokenInfo}
                    isEnabled={!!isEnabled}
                    vtokenAddress={asset.vtokenAddress}
                  >
                    <SupplyWithdrawForm
                      key="withdraw"
                      asset={asset}
                      tokenInfo={tokenInfo}
                      userTotalBorrowBalance={userTotalBorrowBalance}
                      userTotalBorrowLimit={userTotalBorrowLimit}
                      dailyEarnings={dailyEarnings}
                      onSubmit={onSubmit}
                      inputLabel={t('supplyWithdraw.withdrawableAmount')}
                      enabledButtonKey={t('supplyWithdraw.withdraw')}
                      disabledButtonKey={t('supplyWithdraw.enterValidAmountWithdraw')}
                      maxInput={asset.supplyBalance}
                      calculateNewBalance={calculateNewBorrowAmount}
                    />
                  </EnableToken>
                )}
              </ConnectWallet>
            </div>,
          ]}
        />
      </>
    </Modal>
  );
};

const SupplyWithdrawModal: React.FC<
  Omit<ISupplyWithdrawUiProps, 'userTotalBorrowBalance' | 'userTotalBorrowLimit' | 'dailyEarnings'>
> = props => {
  const { account } = useContext(AuthContext);
  const { userTotalBorrowBalance, userTotalBorrowLimit } = useUserMarketInfo({
    account: account?.address,
  });
  // @TODO - use dailyEarnings util https://app.clickup.com/t/26pg8j3
  return (
    <SupplyWithdrawUi
      {...props}
      userTotalBorrowBalance={userTotalBorrowBalance}
      userTotalBorrowLimit={userTotalBorrowLimit}
      dailyEarnings={new BigNumber('238')}
    />
  );
};

export default SupplyWithdrawModal;

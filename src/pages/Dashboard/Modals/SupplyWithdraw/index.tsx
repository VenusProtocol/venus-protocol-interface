/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  LabeledInlineContentProps,
  Modal,
  ModalProps,
  TabContent,
  Tabs,
  TokenIconWithSymbol,
} from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { Asset } from 'types';
import {
  convertTokensToWei,
  formatToReadablePercentage,
  isAssetEnabled,
  unsafelyGetVToken,
} from 'utilities';

import {
  useGetUserMarketInfo,
  useGetVTokenBalanceOf,
  useRedeem,
  useRedeemUnderlying,
} from 'clients/api';
import useSupply from 'clients/api/mutations/useSupply';
import { TOKENS } from 'constants/tokens';
import { AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import Announcement from '../Announcement';
import { useStyles } from '../styles';
import SupplyWithdrawForm from './SupplyWithdrawForm';

export interface SupplyWithdrawUiProps {
  className?: string;
  onClose: ModalProps['handleClose'];
  asset: Asset;
  assets: Asset[];
  isXvsEnabled: boolean;
}

export interface SupplyWithdrawProps {
  userTotalBorrowBalanceCents: BigNumber;
  userTotalBorrowLimitCents: BigNumber;
  onSubmitSupply: AmountFormProps['onSubmit'];
  onSubmitWithdraw: AmountFormProps['onSubmit'];
  isSupplyLoading: boolean;
  isWithdrawLoading: boolean;
}

/**
 * The fade effect on this component results in that it is still rendered after the asset has been set to undefined
 * when closing the modal.
 */
export const SupplyWithdrawUi: React.FC<SupplyWithdrawUiProps & SupplyWithdrawProps> = ({
  className,
  onClose,
  asset,
  assets,
  userTotalBorrowBalanceCents,
  userTotalBorrowLimitCents,
  isXvsEnabled,
  onSubmitSupply,
  onSubmitWithdraw,
  isSupplyLoading,
  isWithdrawLoading,
}) => {
  const styles = useStyles();

  const { id: assetId, symbol } = asset?.token || {};
  const { t } = useTranslation();

  const vBepTokenContractAddress = unsafelyGetVToken(asset.token.id).address;

  const tokenInfo: LabeledInlineContentProps[] = asset
    ? [
        {
          label: t('supplyWithdraw.supplyApy'),
          iconSrc: asset.token,
          children: formatToReadablePercentage(asset.supplyApy),
        },
        {
          label: t('supplyWithdraw.distributionApy'),
          iconSrc: TOKENS.xvs,
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
    onSubmit: AmountFormProps['onSubmit'];
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
        if (userTotalBorrowBalanceCents.isGreaterThanOrEqualTo(userTotalBorrowLimitCents)) {
          return new BigNumber(0);
        }

        const marginWithBorrowLimitDollars = userTotalBorrowLimitCents
          .minus(userTotalBorrowBalanceCents)
          .dividedBy(100);

        const collateralAmountPerTokenDollars = asset.tokenPrice.multipliedBy(
          asset.collateralFactor,
        );
        const maxTokensBeforeLiquidation = marginWithBorrowLimitDollars
          .dividedBy(collateralAmountPerTokenDollars)
          .dp(asset.token.decimals, BigNumber.ROUND_DOWN);

        maxInputTokens = BigNumber.minimum(maxTokensBeforeLiquidation, asset.supplyBalance);
      }

      return maxInputTokens;
    }, []);

    return (
      <div className={className} css={styles.container}>
        <ConnectWallet message={message}>
          {asset && (
            <EnableToken
              token={asset.token}
              spenderAddress={vBepTokenContractAddress}
              title={title}
              tokenInfo={tokenInfo}
            >
              <SupplyWithdrawForm
                key={`form-${type}`}
                asset={asset}
                assets={assets}
                type={type}
                tokenInfo={tokenInfo}
                userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
                userTotalBorrowLimitCents={userTotalBorrowLimitCents}
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

  const tabsContent: TabContent[] = [
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

  // Prevent user from being able to supply a disabled token
  if (isAssetEnabled(assetId)) {
    tabsContent.unshift({
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
    });
  }

  return (
    <Modal
      isOpen={!!assetId}
      handleClose={onClose}
      title={assetId ? <TokenIconWithSymbol token={asset.token} variant="h4" /> : undefined}
    >
      <>
        <Announcement token={asset.token} />

        <Tabs tabsContent={tabsContent} />
      </>
    </Modal>
  );
};

const SupplyWithdrawModal: React.FC<SupplyWithdrawUiProps> = props => {
  const { asset, assets, isXvsEnabled, onClose, ...rest } = props;
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);

  const { t } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
  const {
    data: { userTotalBorrowBalanceCents, userTotalBorrowLimitCents },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  const { data: vTokenBalanceData } = useGetVTokenBalanceOf(
    { accountAddress, vTokenId: asset.token.id },
    { enabled: !!accountAddress },
  );

  const { mutateAsync: supply, isLoading: isSupplyLoading } = useSupply({
    asset,
    account: accountAddress,
  });

  const { mutateAsync: redeem, isLoading: isRedeemLoading } = useRedeem({
    vTokenId: asset?.token.id,
    accountAddress,
  });

  const { mutateAsync: redeemUnderlying, isLoading: isRedeemUnderlyingLoading } =
    useRedeemUnderlying({
      vTokenId: asset?.token.id,
      accountAddress,
    });

  const isWithdrawLoading = isRedeemLoading || isRedeemUnderlyingLoading;

  const onSubmitSupply: AmountFormProps['onSubmit'] = async value => {
    const supplyAmountWei = convertTokensToWei({ value: new BigNumber(value), token: asset.token });
    const res = await supply({
      amountWei: supplyAmountWei,
    });
    onClose();

    openSuccessfulTransactionModal({
      title: t('supplyWithdraw.successfulSupplyTransactionModal.title'),
      content: t('supplyWithdraw.successfulSupplyTransactionModal.message'),
      amount: {
        valueWei: supplyAmountWei,
        token: asset.token,
      },
      transactionHash: res.transactionHash,
    });
  };

  const onSubmitWithdraw: AmountFormProps['onSubmit'] = async value => {
    const amount = new BigNumber(value);
    const amountEqualsSupplyBalance = amount.eq(asset.supplyBalance);
    let transactionHash;

    if (amountEqualsSupplyBalance && vTokenBalanceData?.balanceWei) {
      const res = await redeem({ amountWei: new BigNumber(vTokenBalanceData.balanceWei) });

      ({ transactionHash } = res);
      // Successful transaction modal will display
    } else {
      const withdrawAmountWei = convertTokensToWei({
        value: new BigNumber(value),
        token: asset.token,
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
          valueWei: convertTokensToWei({ value: amount, token: asset.token }),
          token: asset.token,
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
      userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
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

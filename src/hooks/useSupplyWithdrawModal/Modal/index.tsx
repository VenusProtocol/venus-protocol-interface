/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  LabeledInlineContentProps,
  Modal,
  ModalProps,
  Spinner,
  TabContent,
  Tabs,
  TokenIconWithSymbol,
} from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { Asset, Token } from 'types';
import { convertTokensToWei, formatToReadablePercentage, isAssetEnabled } from 'utilities';

import {
  useGetUserAsset,
  useGetUserMarketInfo,
  useGetVTokenBalanceOf,
  useRedeem,
  useRedeemUnderlying,
  useSupply,
} from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import SupplyWithdrawForm from './SupplyWithdrawForm';
import { useStyles } from './styles';

export interface SupplyWithdrawProps {
  onClose: ModalProps['handleClose'];
  includeXvs: boolean;
  token: Token;
  vToken: Token;
}

export interface SupplyWithdrawUiProps extends SupplyWithdrawProps {
  userTotalBorrowBalanceCents: BigNumber;
  userTotalBorrowLimitCents: BigNumber;
  onSubmitSupply: AmountFormProps['onSubmit'];
  onSubmitWithdraw: AmountFormProps['onSubmit'];
  isSupplyLoading: boolean;
  isWithdrawLoading: boolean;
  assets: Asset[];
  className?: string;
  asset?: Asset;
}

/**
 * The fade effect on this component results in that it is still rendered after the asset has been set to undefined
 * when closing the modal.
 */
export const SupplyWithdrawUi: React.FC<SupplyWithdrawUiProps> = ({
  className,
  onClose,
  asset,
  token,
  vToken,
  assets,
  userTotalBorrowBalanceCents,
  userTotalBorrowLimitCents,
  includeXvs,
  onSubmitSupply,
  onSubmitWithdraw,
  isSupplyLoading,
  isWithdrawLoading,
}) => {
  const styles = useStyles();

  const { id: assetId, symbol } = asset?.token || {};
  const { t } = useTranslation();

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
    if (!asset) {
      return <></>;
    }

    const maxInput = React.useMemo(() => {
      if (!asset) {
        return new BigNumber(0);
      }

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
    }, [asset]);

    if (!asset) {
      return <></>;
    }

    return (
      <div className={className} css={styles.container}>
        <ConnectWallet message={message}>
          {asset ? (
            <EnableToken
              token={asset.token}
              spenderAddress={vToken.address}
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
                includeXvs={includeXvs}
              />
            </EnableToken>
          ) : (
            <Spinner />
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

  // Prevent user from being able to supply UST or LUNA
  if (assetId && isAssetEnabled(assetId)) {
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
      title={assetId ? <TokenIconWithSymbol token={token} variant="h4" /> : undefined}
    >
      <Tabs tabsContent={tabsContent} />
    </Modal>
  );
};

const SupplyWithdrawModal: React.FC<SupplyWithdrawProps> = ({
  token,
  vToken,
  includeXvs,
  onClose,
}) => {
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);

  const {
    data: { asset },
  } = useGetUserAsset({ token });

  const {
    data: { assets, userTotalBorrowBalanceCents, userTotalBorrowLimitCents },
  } = useGetUserMarketInfo({
    accountAddress,
  });

  const { t } = useTranslation();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

  const { data: vTokenBalanceData } = useGetVTokenBalanceOf(
    { accountAddress, vToken },
    { enabled: !!accountAddress },
  );

  const { mutateAsync: supply, isLoading: isSupplyLoading } = useSupply({
    vToken,
    accountAddress,
  });

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

  const onSubmitSupply: AmountFormProps['onSubmit'] = async value => {
    const supplyAmountWei = convertTokensToWei({ value: new BigNumber(value), token });
    const res = await supply({
      amountWei: supplyAmountWei,
    });
    onClose();

    openSuccessfulTransactionModal({
      title: t('supplyWithdraw.successfulSupplyTransactionModal.title'),
      content: t('supplyWithdraw.successfulSupplyTransactionModal.message'),
      amount: {
        valueWei: supplyAmountWei,
        token,
      },
      transactionHash: res.transactionHash,
    });
  };

  const onSubmitWithdraw: AmountFormProps['onSubmit'] = async value => {
    if (!asset) {
      return;
    }

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
          valueWei: convertTokensToWei({ value: amount, token }),
          token,
        },
        transactionHash,
      });
    }
  };
  return (
    <SupplyWithdrawUi
      onClose={onClose}
      token={token}
      vToken={vToken}
      asset={asset}
      assets={assets}
      userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      onSubmitSupply={onSubmitSupply}
      onSubmitWithdraw={onSubmitWithdraw}
      isSupplyLoading={isSupplyLoading}
      isWithdrawLoading={isWithdrawLoading}
      includeXvs={includeXvs}
    />
  );
};

export default SupplyWithdrawModal;

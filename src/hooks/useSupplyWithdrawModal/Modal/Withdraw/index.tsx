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
import { Asset, Pool, VToken } from 'types';
import { areTokensEqual, convertTokensToWei, formatToReadablePercentage } from 'utilities';

import { useGetPool, useRedeem, useRedeemUnderlying } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { useStyles } from '../styles';
import WithdrawForm from './form';

export interface WithdrawProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
  poolComptrollerAddress: string;
}

export interface WithdrawUiProps extends Omit<WithdrawProps, 'vToken' | 'poolComptrollerAddress'> {
  onSubmit: AmountFormProps['onSubmit'];
  isLoading: boolean;
  className?: string;
  asset?: Asset;
  pool?: Pool;
}

export const WithdrawUi: React.FC<WithdrawUiProps> = ({
  className,
  asset,
  pool,
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
    if (
      !asset ||
      pool?.userBorrowBalanceCents === undefined ||
      pool?.userBorrowLimitCents === undefined
    ) {
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
      if (pool.userBorrowBalanceCents > pool.userBorrowLimitCents) {
        return new BigNumber(0);
      }

      const marginWithBorrowLimitDollars =
        (pool.userBorrowLimitCents - pool.userBorrowBalanceCents) / 100;

      const collateralAmountPerTokenDollars = asset.tokenPriceDollars.multipliedBy(
        asset.collateralFactor,
      );
      const maxTokensBeforeLiquidation = new BigNumber(marginWithBorrowLimitDollars)
        .dividedBy(collateralAmountPerTokenDollars)
        .dp(asset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN);

      maxInputTokens = BigNumber.minimum(maxTokensBeforeLiquidation, asset.userSupplyBalanceTokens);
    }

    return maxInputTokens;
  }, [asset, pool]);

  return (
    <div className={className} css={styles.container}>
      <ConnectWallet message={t('supplyWithdraw.connectWalletToWithdraw')}>
        {asset && pool ? (
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
              pool={pool}
              tokenInfo={tokenInfo}
              onSubmit={onSubmit}
              inputLabel={t('supplyWithdraw.withdrawableAmount')}
              enabledButtonKey={t('supplyWithdraw.withdraw')}
              disabledButtonKey={t('supplyWithdraw.enterValidAmountWithdraw')}
              maxInput={maxInput}
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

const WithdrawModal: React.FC<WithdrawProps> = ({ vToken, poolComptrollerAddress, onClose }) => {
  const { account: { address: accountAddress = '' } = {} } = useContext(AuthContext);

  const { data: getPoolData } = useGetPool({ poolComptrollerAddress, accountAddress });
  const pool = getPoolData?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

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
      pool={pool}
      onSubmit={onSubmit}
      isLoading={isWithdrawLoading}
    />
  );
};

export default WithdrawModal;

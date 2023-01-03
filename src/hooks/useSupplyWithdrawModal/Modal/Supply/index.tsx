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

import { useGetAsset, useGetMainAssets, useSupply } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AmountFormProps } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';

import { useStyles } from '../styles';
import SupplyForm from './form';

export interface SupplyProps {
  onClose: ModalProps['handleClose'];
  vToken: VToken;
}

export interface SupplyUiProps extends Omit<SupplyProps, 'token' | 'vToken'> {
  userTotalBorrowBalanceCents: BigNumber;
  userTotalBorrowLimitCents: BigNumber;
  onSubmit: AmountFormProps['onSubmit'];
  isLoading: boolean;
  assets: Asset[];
  className?: string;
  asset?: Asset;
}

export const SupplyUi: React.FC<SupplyUiProps> = ({
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

    const maxInputTokens = asset.userWalletBalanceTokens;

    return maxInputTokens;
  }, [asset]);

  return (
    <div className={className} css={styles.container}>
      <ConnectWallet message={t('supplyWithdraw.connectWalletToSupply')}>
        {asset ? (
          <EnableToken
            token={asset.vToken.underlyingToken}
            spenderAddress={asset.vToken.address}
            title={t('supplyWithdraw.enableToSupply', {
              symbol: asset?.vToken.underlyingToken.symbol,
            })}
            tokenInfo={tokenInfo}
          >
            <SupplyForm
              key="form-supply"
              asset={asset}
              assets={assets}
              tokenInfo={tokenInfo}
              userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
              userTotalBorrowLimitCents={userTotalBorrowLimitCents}
              onSubmit={onSubmit}
              inputLabel={t('supplyWithdraw.walletBalance')}
              enabledButtonKey={t('supplyWithdraw.supply')}
              disabledButtonKey={t('supplyWithdraw.enterValidAmountSupply')}
              maxInput={maxInput}
              calculateNewBalance={(initial: BigNumber, amount: BigNumber) => initial.plus(amount)}
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

const SupplyModal: React.FC<SupplyProps> = ({ vToken, onClose }) => {
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

  const { mutateAsync: supply, isLoading: isSupplyLoading } = useSupply({
    vToken,
    accountAddress,
  });

  const onSubmit: AmountFormProps['onSubmit'] = async value => {
    const supplyAmountWei = convertTokensToWei({
      value: new BigNumber(value),
      token: vToken.underlyingToken,
    });
    const res = await supply({
      amountWei: supplyAmountWei,
    });
    onClose();

    openSuccessfulTransactionModal({
      title: t('supplyWithdraw.successfulSupplyTransactionModal.title'),
      content: t('supplyWithdraw.successfulSupplyTransactionModal.message'),
      amount: {
        valueWei: supplyAmountWei,
        token: vToken.underlyingToken,
      },
      transactionHash: res.transactionHash,
    });
  };

  return (
    <SupplyUi
      onClose={onClose}
      asset={asset}
      assets={assets}
      userTotalBorrowBalanceCents={userTotalBorrowBalanceCents}
      userTotalBorrowLimitCents={userTotalBorrowLimitCents}
      isLoading={isSupplyLoading}
      onSubmit={onSubmit}
    />
  );
};

export default SupplyModal;

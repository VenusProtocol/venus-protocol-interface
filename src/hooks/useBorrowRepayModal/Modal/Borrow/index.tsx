/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  AccountData,
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  FormikTokenTextField,
  IsolatedAssetWarning,
  Spinner,
} from 'components';
import { ContractReceipt } from 'ethers';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, Pool, VToken } from 'types';
import { areTokensEqual, convertTokensToWei, formatTokensToReadableValue } from 'utilities';

import { useBorrow, useGetPool } from 'clients/api';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';
import { useAuth } from 'context/AuthContext';
import useAssetInfo from 'hooks/useAssetInfo';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';
import Notice from './Notice';
import TEST_IDS from './testIds';

// TODO: add stories

export interface BorrowFormProps {
  asset: Asset;
  pool: Pool;
  limitTokens: string;
  safeBorrowLimitPercentage: number;
  safeLimitTokens: string;
  borrow: (amountWei: BigNumber) => Promise<ContractReceipt>;
  isBorrowLoading: boolean;
}

export const BorrowForm: React.FC<BorrowFormProps> = ({
  asset,
  pool,
  limitTokens,
  safeBorrowLimitPercentage,
  safeLimitTokens,
  borrow,
  isBorrowLoading,
}) => {
  const { t, Trans } = useTranslation();
  const sharedStyles = useStyles();

  const hasUserCollateralizedSuppliedAssets = (pool?.userBorrowLimitCents || 0) > 0;

  const handleTransactionMutation = useHandleTransactionMutation();

  const readableTokenBorrowableAmount = React.useMemo(
    () =>
      formatTokensToReadableValue({
        value: new BigNumber(limitTokens),
        token: asset.vToken.underlyingToken,
      }),
    [limitTokens],
  );

  const onSubmit: AmountFormProps['onSubmit'] = async amountTokens => {
    const formattedAmountTokens = new BigNumber(amountTokens);

    const amountWei = convertTokensToWei({
      value: formattedAmountTokens,
      token: asset.vToken.underlyingToken,
    });

    return handleTransactionMutation({
      mutate: () => borrow(amountWei),
      successTransactionModalProps: contractReceipt => ({
        title: t('borrowRepayModal.borrow.successfulTransactionModal.title'),
        content: t('borrowRepayModal.borrow.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: asset.vToken.underlyingToken,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
      {({ values, dirty, isValid, errors }) => (
        <>
          {pool.isIsolated && (
            <IsolatedAssetWarning
              pool={pool}
              token={asset.vToken.underlyingToken}
              type="borrow"
              css={sharedStyles.isolatedAssetWarning}
            />
          )}

          <div css={[sharedStyles.getRow({ isLast: true })]}>
            <FormikTokenTextField
              name="amount"
              token={asset.vToken.underlyingToken}
              disabled={isBorrowLoading || !hasUserCollateralizedSuppliedAssets}
              rightMaxButton={{
                label: t('borrowRepayModal.borrow.rightMaxButtonLabel', {
                  limitPercentage: safeBorrowLimitPercentage,
                }),
                valueOnClick: safeLimitTokens,
              }}
              data-testid={TEST_IDS.tokenTextField}
              // Only display error state if amount is higher than borrow limit
              hasError={errors.amount === ErrorCode.HIGHER_THAN_MAX}
              description={
                <Trans
                  i18nKey="borrowRepayModal.borrow.borrowableAmount"
                  components={{
                    White: <span css={sharedStyles.whiteLabel} />,
                  }}
                  values={{ amount: readableTokenBorrowableAmount }}
                />
              }
            />

            <Notice
              hasUserCollateralizedSuppliedAssets={hasUserCollateralizedSuppliedAssets}
              amount={values.amount}
              safeLimitTokens={safeLimitTokens}
              limitTokens={limitTokens}
              asset={asset}
            />
          </div>

          <AccountData
            asset={asset}
            pool={pool}
            amountTokens={new BigNumber(values.amount || 0)}
            action="borrow"
          />

          <FormikSubmitButton
            loading={isBorrowLoading}
            disabled={!isValid || !dirty || isBorrowLoading || !hasUserCollateralizedSuppliedAssets}
            fullWidth
            enabledLabel={t('borrowRepayModal.borrow.submitButton')}
            disabledLabel={t('borrowRepayModal.borrow.submitButtonDisabled')}
          />
        </>
      )}
    </AmountForm>
  );
};

export interface BorrowProps {
  vToken: VToken;
  poolComptrollerAddress: string;
  onClose: () => void;
}

const Borrow: React.FC<BorrowProps> = ({ vToken, poolComptrollerAddress, onClose }) => {
  const { t } = useTranslation();
  const { accountAddress } = useAuth();

  const { data: getPoolData } = useGetPool({
    poolComptrollerAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;
  const asset = pool?.assets.find(item => areTokensEqual(item.vToken, vToken));

  const { mutateAsync: borrow, isLoading: isBorrowLoading } = useBorrow({
    vToken,
  });

  const handleBorrow: BorrowFormProps['borrow'] = async amountWei => {
    const res = await borrow({
      amountWei,
    });

    // Close modal on success
    onClose();

    return res;
  };

  // Calculate maximum and safe maximum amount of tokens user can borrow
  const [limitTokens, safeLimitTokens] = React.useMemo(() => {
    // Return 0 values while asset is loading or if borrow limit has been
    // reached
    if (
      !asset ||
      !pool ||
      pool.userBorrowBalanceCents === undefined ||
      !pool.userBorrowLimitCents ||
      pool.userBorrowBalanceCents >= pool.userBorrowLimitCents
    ) {
      return ['0', '0'];
    }

    const marginWithBorrowLimitDollars =
      (pool.userBorrowLimitCents - pool.userBorrowBalanceCents) /
      // Convert cents to dollars
      100;
    const liquidityDollars = asset.liquidityCents / 100;

    let maxTokens = BigNumber.minimum(liquidityDollars, marginWithBorrowLimitDollars)
      // Convert dollars to tokens
      .dividedBy(asset.tokenPriceDollars);

    // Take borrow cap in consideration if asset has one
    if (asset.borrowCapTokens) {
      const marginWithBorrowCapTokens = asset.borrowCapTokens.minus(asset.userBorrowBalanceTokens);
      maxTokens = BigNumber.minimum(maxTokens, marginWithBorrowCapTokens);
    }

    const safeBorrowLimitCents = (pool.userBorrowLimitCents * SAFE_BORROW_LIMIT_PERCENTAGE) / 100;
    const marginWithSafeBorrowLimitDollars =
      (safeBorrowLimitCents - pool.userBorrowBalanceCents) /
      // Convert cents to dollars
      100;

    const safeMaxTokens =
      pool.userBorrowBalanceCents < safeBorrowLimitCents
        ? // Convert dollars to tokens
          new BigNumber(marginWithSafeBorrowLimitDollars).dividedBy(asset.tokenPriceDollars)
        : new BigNumber(0);

    const formatValue = (value: BigNumber) =>
      value.dp(vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN).toFixed();

    return [formatValue(maxTokens), formatValue(safeMaxTokens)];
  }, [vToken.underlyingToken.decimals, asset, pool]);

  const assetInfo = useAssetInfo({
    asset,
    type: 'borrow',
  });

  return (
    <ConnectWallet message={t('borrowRepayModal.borrow.connectWalletMessage')}>
      {asset && pool ? (
        <EnableToken
          token={vToken.underlyingToken}
          spenderAddress={vToken.address}
          title={t('borrowRepayModal.borrow.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          assetInfo={assetInfo}
        >
          <BorrowForm
            asset={asset}
            pool={pool}
            limitTokens={limitTokens}
            safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
            safeLimitTokens={safeLimitTokens}
            borrow={handleBorrow}
            isBorrowLoading={isBorrowLoading}
          />
        </EnableToken>
      ) : (
        <Spinner />
      )}
    </ConnectWallet>
  );
};

export default Borrow;

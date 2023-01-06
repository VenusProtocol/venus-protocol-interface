/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import {
  ConnectWallet,
  EnableToken,
  FormikSubmitButton,
  FormikTokenTextField,
  IsolatedAssetWarning,
  NoticeWarning,
  Spinner,
} from 'components';
import { VError } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, VToken } from 'types';
import {
  convertTokensToWei,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';
import type { TransactionReceipt } from 'web3-core/types';

import { poolData } from '__mocks__/models/pools';
import { useBorrow, useGetAsset, useGetMainAssets } from 'clients/api';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { TOKENS } from 'constants/tokens';
import { AmountForm, AmountFormProps, ErrorCode } from 'containers/AmountForm';
import { AuthContext } from 'context/AuthContext';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import AccountData from '../AccountData';
import { useStyles } from '../styles';
import TEST_IDS from './testIds';

export interface BorrowFormProps {
  asset: Asset;
  limitTokens: string;
  safeBorrowLimitPercentage: number;
  safeLimitTokens: string;
  borrow: (amountWei: BigNumber) => Promise<TransactionReceipt>;
  isBorrowLoading: boolean;
  hasUserCollateralizedSuppliedAssets: boolean;
}

export const BorrowForm: React.FC<BorrowFormProps> = ({
  asset,
  limitTokens,
  safeBorrowLimitPercentage,
  safeLimitTokens,
  borrow,
  isBorrowLoading,
  hasUserCollateralizedSuppliedAssets,
}) => {
  const { t, Trans } = useTranslation();
  const sharedStyles = useStyles();

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
      successTransactionModalProps: transactionReceipt => ({
        title: t('borrowRepayModal.borrow.successfulTransactionModal.title'),
        content: t('borrowRepayModal.borrow.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: asset.vToken.underlyingToken,
        },
        transactionHash: transactionReceipt.transactionHash,
      }),
    });
  };

  // TODO: fetch actual value (see VEN-546)
  const isIsolatedAsset = true;

  return (
    <AmountForm onSubmit={onSubmit} maxAmount={limitTokens}>
      {({ values, dirty, isValid, errors }) => (
        <>
          {isIsolatedAsset && (
            // TODO: fetch actual values (see VEN-546)
            <IsolatedAssetWarning
              pool={poolData[0]}
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

            {(!hasUserCollateralizedSuppliedAssets || +values.amount > +safeLimitTokens) && (
              <NoticeWarning
                css={sharedStyles.notice}
                description={
                  +values.amount > +safeLimitTokens
                    ? t('borrowRepayModal.borrow.highAmountWarning')
                    : t('borrowRepayModal.borrow.noCollateralizedSuppliedAssetWarning', {
                        tokenSymbol: asset.vToken.underlyingToken.symbol,
                      })
                }
              />
            )}
          </div>

          <AccountData hypotheticalBorrowAmountTokens={+values.amount} asset={asset} />

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
  onClose: () => void;
}

const Borrow: React.FC<BorrowProps> = ({ vToken, onClose }) => {
  const { t } = useTranslation();
  const { account } = React.useContext(AuthContext);

  const { data: getAssetData } = useGetAsset({ vToken, accountAddress: account?.address });

  const { data: getMainAssetsData } = useGetMainAssets({
    accountAddress: account?.address,
  });

  const hasUserCollateralizedSuppliedAssets = React.useMemo(
    () =>
      !!getMainAssetsData?.assets &&
      getMainAssetsData.assets.some(
        userAsset =>
          userAsset.isCollateralOfUser && userAsset.userSupplyBalanceTokens.isGreaterThan(0),
      ),
    [getMainAssetsData?.assets],
  );

  const { mutateAsync: borrow, isLoading: isBorrowLoading } = useBorrow({
    vToken,
  });

  const handleBorrow: BorrowFormProps['borrow'] = async amountWei => {
    if (!account?.address) {
      throw new VError({ type: 'unexpected', code: 'walletNotConnected' });
    }
    const res = await borrow({
      amountWei,
      fromAccountAddress: account.address,
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
      !getAssetData?.asset ||
      !getMainAssetsData ||
      getMainAssetsData.userTotalBorrowBalanceCents.isGreaterThanOrEqualTo(
        getMainAssetsData.userTotalBorrowLimitCents,
      )
    ) {
      return ['0', '0'];
    }

    const marginWithBorrowLimitDollars = getMainAssetsData.userTotalBorrowLimitCents
      .minus(getMainAssetsData.userTotalBorrowBalanceCents)
      // Convert cents to dollars
      .dividedBy(100);
    const liquidityDollars = getAssetData.asset.liquidityCents / 100;
    const maxTokens = BigNumber.minimum(liquidityDollars, marginWithBorrowLimitDollars)
      // Convert dollars to tokens
      .dividedBy(getAssetData.asset.tokenPriceDollars);

    const safeBorrowLimitCents = getMainAssetsData.userTotalBorrowLimitCents.multipliedBy(
      SAFE_BORROW_LIMIT_PERCENTAGE / 100,
    );
    const marginWithSafeBorrowLimitDollars = safeBorrowLimitCents
      .minus(getMainAssetsData.userTotalBorrowBalanceCents)
      // Convert cents to dollars
      .dividedBy(100);

    const safeMaxTokens = getMainAssetsData.userTotalBorrowBalanceCents.isLessThan(
      safeBorrowLimitCents,
    )
      ? // Convert dollars to tokens
        marginWithSafeBorrowLimitDollars.dividedBy(getAssetData.asset.tokenPriceDollars)
      : new BigNumber(0);

    const formatValue = (value: BigNumber) =>
      value.dp(vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN).toFixed();

    return [formatValue(maxTokens), formatValue(safeMaxTokens)];
  }, [
    getAssetData?.asset?.tokenPriceDollars,
    getAssetData?.asset?.liquidityCents,
    getMainAssetsData?.userTotalBorrowLimitCents.toFixed(),
    getMainAssetsData?.userTotalBorrowBalanceCents.toFixed(),
  ]);

  return (
    <ConnectWallet message={t('borrowRepayModal.borrow.connectWalletMessage')}>
      {getAssetData?.asset ? (
        <EnableToken
          token={vToken.underlyingToken}
          spenderAddress={vToken.address}
          title={t('borrowRepayModal.borrow.enableToken.title', {
            symbol: vToken.underlyingToken.symbol,
          })}
          tokenInfo={[
            {
              label: t('borrowRepayModal.borrow.enableToken.borrowInfo'),
              iconSrc: vToken.underlyingToken,
              children: formatToReadablePercentage(getAssetData.asset.borrowApyPercentage),
            },
            {
              label: t('borrowRepayModal.borrow.enableToken.distributionInfo'),
              iconSrc: TOKENS.xvs,
              children: formatToReadablePercentage(getAssetData.asset.xvsBorrowApy),
            },
          ]}
        >
          <BorrowForm
            asset={getAssetData.asset}
            limitTokens={limitTokens}
            safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
            safeLimitTokens={safeLimitTokens}
            borrow={handleBorrow}
            isBorrowLoading={isBorrowLoading}
            hasUserCollateralizedSuppliedAssets={hasUserCollateralizedSuppliedAssets}
          />
        </EnableToken>
      ) : (
        <Spinner />
      )}
    </ConnectWallet>
  );
};

export default Borrow;

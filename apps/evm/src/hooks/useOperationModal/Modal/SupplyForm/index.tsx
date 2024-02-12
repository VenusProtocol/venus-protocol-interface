/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

import { useSupply, useSwapTokensAndSupply } from 'clients/api';
import {
  AssetWarning,
  Delimiter,
  LabeledInlineContent,
  NoticeInfo,
  SelectTokenTextField,
  SpendingLimit,
  SwapDetails,
  Toggle,
  TokenTextField,
} from 'components';
import { AccountData } from 'containers/AccountData';
import { Link } from 'containers/Link';
import useCollateral from 'hooks/useCollateral';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import { useGetSwapRouterContractAddress } from 'packages/contracts';
import { VError, displayMutationError } from 'packages/errors';
import { isTokenActionEnabled } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { useAccountAddress, useChainId } from 'packages/wallet';
import { Asset, ChainId, Pool, Swap, SwapError, TokenBalance } from 'types';
import { areTokensEqual, convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import Notice from './Notice';
import SubmitSection, { SubmitSectionProps } from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { FormValues, UseFormInput } from './useForm';

export const PRESET_PERCENTAGES = [25, 50, 75, 100];
// TODO: rework or remove this URL, as this is likely to be a temporary solution
const UNISWAP_URL =
  'https://app.uniswap.org/swap?chain=mainnet&inputCurrency=ETH&outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

export interface SupplyFormUiProps
  extends Pick<
    SubmitSectionProps,
    | 'approveFromToken'
    | 'isApproveFromTokenLoading'
    | 'isFromTokenApproved'
    | 'isFromTokenWalletSpendingLimitLoading'
  > {
  asset: Asset;
  pool: Pool;
  isIntegratedSwapEnabled: boolean;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  onCloseModal: () => void;
  tokenBalances?: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  chainId: ChainId;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

export const SupplyFormUi: React.FC<SupplyFormUiProps> = ({
  asset,
  pool,
  isIntegratedSwapEnabled,
  onCloseModal,
  onSubmit,
  isSubmitting,
  tokenBalances = [],
  setFormValues,
  formValues,
  isSwapLoading,
  approveFromToken,
  isApproveFromTokenLoading,
  isFromTokenApproved,
  isFromTokenWalletSpendingLimitLoading,
  fromTokenWalletSpendingLimitTokens,
  revokeFromTokenWalletSpendingLimit,
  isRevokeFromTokenWalletSpendingLimitLoading,
  chainId,
  swap,
  swapError,
}) => {
  const { t, Trans } = useTranslation();
  const sharedStyles = useSharedStyles();
  const { CollateralModal, toggleCollateral } = useCollateral();
  const { nativeToken } = useGetChainMetadata();

  const isIntegratedSwapFeatureEnabled = useMemo(
    () =>
      isIntegratedSwapEnabled &&
      // Check swap and supply action is enabled for underlying token
      isTokenActionEnabled({
        tokenAddress: asset.vToken.underlyingToken.address,
        action: 'swapAndSupply',
        chainId,
      }) &&
      // Check swap and supply action is enabled for vToken
      isTokenActionEnabled({
        tokenAddress: asset.vToken.address,
        action: 'swapAndSupply',
        chainId,
      }),
    [asset.vToken.underlyingToken, asset.vToken.address, chainId, isIntegratedSwapEnabled],
  );

  const isUsingSwap = useMemo(
    () =>
      isIntegratedSwapFeatureEnabled &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken),
    [isIntegratedSwapFeatureEnabled, formValues.fromToken, asset.vToken.underlyingToken],
  );

  const fromTokenUserWalletBalanceTokens = useMemo(() => {
    // Get wallet balance from the list of fetched token balances if integrated
    // swap feature is enabled and the selected token is different from the
    // asset object
    if (isUsingSwap) {
      const tokenBalance = tokenBalances.find(item =>
        areTokensEqual(item.token, formValues.fromToken),
      );

      return (
        tokenBalance &&
        convertMantissaToTokens({
          value: tokenBalance.balanceMantissa,
          token: tokenBalance.token,
        })
      );
    }

    // Otherwise get the wallet balance from the asset object
    return asset.userWalletBalanceTokens;
  }, [isUsingSwap, asset.userWalletBalanceTokens, formValues.fromToken, tokenBalances]);

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    swap,
    swapError,
    onCloseModal,
    onSubmit,
    formValues,
    setFormValues,
  });

  const readableFromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const handleToggleCollateral = async () => {
    try {
      await toggleCollateral({
        asset,
        poolName: pool.name,
        comptrollerAddress: pool.comptrollerAddress,
      });
    } catch (error) {
      displayMutationError({ error });
    }
  };

  const handleRightMaxButtonClick = useCallback(() => {
    // Update field value to correspond to user's wallet balance
    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: new BigNumber(fromTokenUserWalletBalanceTokens || 0).toFixed(),
    }));
  }, [fromTokenUserWalletBalanceTokens, setFormValues]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <AssetWarning
          token={asset.vToken.underlyingToken}
          pool={pool}
          type="supply"
          css={sharedStyles.assetWarning}
          data-testid={TEST_IDS.noticeAssetWarning}
        />

        {asset.vToken.underlyingToken.wrapsNative && (
          <NoticeInfo
            className="mb-6"
            description={
              <Trans
                i18nKey="operationModal.supply.youCanWrapNative"
                components={{
                  Link: <Link href={UNISWAP_URL} />,
                }}
                values={{
                  nativeTokenSymbol: nativeToken.symbol,
                  wrappedNativeTokenSymbol: asset.vToken.underlyingToken.symbol,
                }}
              />
            }
          />
        )}

        {(asset.collateralFactor || asset.isCollateralOfUser) && (
          <LabeledInlineContent
            label={t('operationModal.supply.collateral')}
            css={sharedStyles.getRow({ isLast: true })}
          >
            <Toggle onChange={handleToggleCollateral} value={asset.isCollateralOfUser} />
          </LabeledInlineContent>
        )}

        <div css={sharedStyles.getRow({ isLast: true })}>
          {isIntegratedSwapFeatureEnabled ? (
            <SelectTokenTextField
              data-testid={TEST_IDS.selectTokenTextField}
              selectedToken={formValues.fromToken}
              value={formValues.amountTokens}
              hasError={!isSubmitting && !!formError && Number(formValues.amountTokens) > 0}
              disabled={
                isSubmitting ||
                isApproveFromTokenLoading ||
                formError === 'SUPPLY_CAP_ALREADY_REACHED'
              }
              onChange={amountTokens =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  amountTokens,
                }))
              }
              onChangeSelectedToken={fromToken =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  fromToken,
                }))
              }
              rightMaxButton={{
                label: t('operationModal.supply.rightMaxButtonLabel'),
                onClick: handleRightMaxButtonClick,
              }}
              tokenBalances={tokenBalances}
            />
          ) : (
            <TokenTextField
              data-testid={TEST_IDS.tokenTextField}
              name="amountTokens"
              token={asset.vToken.underlyingToken}
              value={formValues.amountTokens}
              onChange={amountTokens =>
                setFormValues(currentFormValues => ({
                  ...currentFormValues,
                  amountTokens,
                  // Reset selected fixed percentage
                  fixedRepayPercentage: undefined,
                }))
              }
              disabled={
                isSubmitting ||
                isApproveFromTokenLoading ||
                formError === 'SUPPLY_CAP_ALREADY_REACHED'
              }
              rightMaxButton={{
                label: t('operationModal.supply.rightMaxButtonLabel'),
                onClick: handleRightMaxButtonClick,
              }}
              hasError={!isSubmitting && !!formError && Number(formValues.amountTokens) > 0}
            />
          )}

          {!isSubmitting && !isSwapLoading && (
            <Notice asset={asset} swap={swap} formError={formError} />
          )}
        </div>

        <div css={sharedStyles.getRow({ isLast: true })}>
          <LabeledInlineContent
            label={t('operationModal.supply.walletBalance')}
            css={sharedStyles.getRow({ isLast: false })}
          >
            {readableFromTokenUserWalletBalanceTokens}
          </LabeledInlineContent>

          <SpendingLimit
            token={formValues.fromToken}
            walletBalanceTokens={fromTokenUserWalletBalanceTokens}
            walletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
            onRevoke={revokeFromTokenWalletSpendingLimit}
            isRevokeLoading={isRevokeFromTokenWalletSpendingLimitLoading}
            data-testid={TEST_IDS.spendingLimit}
          />
        </div>

        {isUsingSwap && (
          <SwapDetails
            action="supply"
            swap={swap}
            data-testid={TEST_IDS.swapDetails}
            css={sharedStyles.getRow({ isLast: true })}
          />
        )}

        <Delimiter css={sharedStyles.getRow({ isLast: true })} />

        <AccountData
          asset={asset}
          pool={pool}
          swap={swap}
          amountTokens={new BigNumber(formValues.amountTokens || 0)}
          action="supply"
          isUsingSwap={isUsingSwap}
          className="mb-6"
        />

        <SubmitSection
          isFormSubmitting={isSubmitting}
          isFormValid={isFormValid}
          isSwapLoading={isSwapLoading}
          swap={swap}
          formError={formError}
          toToken={asset.vToken.underlyingToken}
          fromToken={formValues.fromToken}
          fromTokenAmountTokens={formValues.amountTokens}
          approveFromToken={approveFromToken}
          isApproveFromTokenLoading={isApproveFromTokenLoading}
          isFromTokenApproved={isFromTokenApproved}
          isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
          isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
        />
      </form>

      <CollateralModal />
    </>
  );
};

export interface SupplyFormProps {
  asset: Asset;
  pool: Pool;
  onCloseModal: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({ asset, pool, onCloseModal }) => {
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
  });

  const swapRouterContractAddress = useGetSwapRouterContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const spenderAddress = areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken)
    ? asset.vToken.address
    : swapRouterContractAddress;

  const {
    isTokenApproved: isFromTokenApproved,
    approveToken: approveFromToken,
    isApproveTokenLoading: isApproveFromTokenLoading,
    isWalletSpendingLimitLoading: isFromTokenWalletSpendingLimitLoading,
    walletSpendingLimitTokens: fromTokenWalletSpendingLimitTokens,
    revokeWalletSpendingLimit: revokeFromTokenWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading: isRevokeFromTokenWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: formValues.fromToken,
    spenderAddress,
    accountAddress,
  });

  const { data: tokenBalances } = useGetSwapTokenUserBalances(
    {
      accountAddress,
    },
    {
      enabled: isIntegratedSwapEnabled,
    },
  );

  const { mutateAsync: supply, isLoading: isSupplyLoading } = useSupply({
    poolName: pool.name,
    vToken: asset.vToken,
  });

  const { mutateAsync: swapExactTokensForTokensAndSupply, isLoading: isSwapAndSupplyLoading } =
    useSwapTokensAndSupply({
      poolName: pool.name,
      poolComptrollerAddress: pool.comptrollerAddress,
      vToken: asset.vToken,
    });

  const isSubmitting = isSupplyLoading || isSwapAndSupplyLoading;

  const onSubmit: SupplyFormUiProps['onSubmit'] = async ({
    toVToken,
    fromToken,
    fromTokenAmountTokens,
    swap,
  }) => {
    const isSwapping = !areTokensEqual(fromToken, toVToken.underlyingToken);

    // Handle supply flow
    if (!isSwapping) {
      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      return supply({ amountMantissa });
    }

    // Throw an error if we're meant to execute a swap but no swap was
    // passed through props. This should never happen since the form is
    // disabled while swap infos are being fetched, but we add this logic
    // as a safeguard
    if (!swap) {
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return swapExactTokensForTokensAndSupply({
      swap,
    });
  };

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: formValues.amountTokens,
    toToken: asset.vToken.underlyingToken,
    direction: 'exactAmountIn',
  });

  return (
    <SupplyFormUi
      asset={asset}
      pool={pool}
      isIntegratedSwapEnabled={isIntegratedSwapEnabled}
      chainId={chainId}
      formValues={formValues}
      setFormValues={setFormValues}
      onCloseModal={onCloseModal}
      tokenBalances={tokenBalances}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      swap={swapInfo.swap}
      swapError={swapInfo.error}
      isSwapLoading={swapInfo.isLoading}
      isFromTokenApproved={isFromTokenApproved}
      approveFromToken={approveFromToken}
      isApproveFromTokenLoading={isApproveFromTokenLoading}
      isFromTokenWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
      fromTokenWalletSpendingLimitTokens={fromTokenWalletSpendingLimitTokens}
      revokeFromTokenWalletSpendingLimit={revokeFromTokenWalletSpendingLimit}
      isRevokeFromTokenWalletSpendingLimitLoading={isRevokeFromTokenWalletSpendingLimitLoading}
    />
  );
};

export default SupplyForm;

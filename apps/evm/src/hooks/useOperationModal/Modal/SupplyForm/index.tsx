/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useCallback, useMemo, useState } from 'react';

import {
  useGetBalanceOf,
  useSupply,
  useSwapTokensAndSupply,
  useWrapTokensAndSupply,
} from 'clients/api';
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
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import {
  useGetNativeTokenGatewayContractAddress,
  useGetSwapRouterContractAddress,
} from 'libs/contracts';
import { VError, displayMutationError } from 'libs/errors';
import { isTokenActionEnabled } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Asset, Pool, Swap, SwapError, TokenBalance } from 'types';
import { areTokensEqual, convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import { useStyles as useSharedStyles } from '../styles';
import Notice from './Notice';
import SubmitSection, { type SubmitSectionProps } from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

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
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  onCloseModal: () => void;
  nativeWrappedTokenBalances: TokenBalance[];
  integratedSwapTokenBalances: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  isWrapUnwrapNativeTokenEnabled: boolean;
  isIntegratedSwapFeatureEnabled: boolean;
  canWrapNativeToken: boolean;
  isWrappingNativeToken: boolean;
  isUsingSwap: boolean;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

export const SupplyFormUi: React.FC<SupplyFormUiProps> = ({
  asset,
  pool,
  onCloseModal,
  onSubmit,
  isSubmitting,
  nativeWrappedTokenBalances,
  integratedSwapTokenBalances,
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
  isWrapUnwrapNativeTokenEnabled,
  isIntegratedSwapFeatureEnabled,
  canWrapNativeToken,
  isWrappingNativeToken,
  isUsingSwap,
  swap,
  swapError,
}) => {
  const { t, Trans } = useTranslation();
  const sharedStyles = useSharedStyles();
  const { CollateralModal, toggleCollateral } = useCollateral();

  const tokenBalances = useMemo(
    () => [...integratedSwapTokenBalances, ...nativeWrappedTokenBalances],
    [integratedSwapTokenBalances, nativeWrappedTokenBalances],
  );

  const fromTokenUserWalletBalanceTokens = useMemo(() => {
    // Get wallet balance from the list of fetched token balances if integrated
    // swap feature is enabled and the selected token is different from the
    // asset object
    if (isUsingSwap || isWrappingNativeToken) {
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
  }, [
    isUsingSwap,
    isWrappingNativeToken,
    asset.userWalletBalanceTokens,
    formValues.fromToken,
    tokenBalances,
  ]);

  // Determine the amount of tokens the user can supply, taking the supply cap and their wallet
  // balance in consideration
  const supplyableFromTokenAmountTokens = useMemo(() => {
    if (isUsingSwap || !fromTokenUserWalletBalanceTokens) {
      return undefined;
    }

    const marginWithSupplyCapTokens = asset.supplyCapTokens
      ? asset.supplyCapTokens.minus(asset.supplyBalanceTokens)
      : new BigNumber(Number.POSITIVE_INFINITY);

    return BigNumber.min(marginWithSupplyCapTokens, fromTokenUserWalletBalanceTokens);
  }, [
    isUsingSwap,
    asset.supplyBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    asset.supplyCapTokens,
  ]);

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

  const readableSupplyableFromTokenAmountTokens = useFormatTokensToReadableValue({
    value: supplyableFromTokenAmountTokens,
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
    // If user is using swap, we fill the input with the user's wallet balance as we don't have a
    // way to know in advance exactly how much of the fromToken they can supply to
    let amountTokens = new BigNumber(fromTokenUserWalletBalanceTokens || 0);

    // If a user is not swapping, we fill the input with the maximum supplyable amount of fromTokens
    if (!isUsingSwap && supplyableFromTokenAmountTokens) {
      amountTokens = supplyableFromTokenAmountTokens;
    }

    // If user has set a spending limit for fromToken, then we take it in consideration
    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      amountTokens = BigNumber.min(amountTokens, fromTokenWalletSpendingLimitTokens);
    }

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: amountTokens.toFixed(),
    }));
  }, [
    fromTokenUserWalletBalanceTokens,
    setFormValues,
    isUsingSwap,
    fromTokenWalletSpendingLimitTokens,
    supplyableFromTokenAmountTokens,
  ]);

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

        {!isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped && (
          <NoticeInfo
            className="mb-6"
            description={
              <Trans
                i18nKey="operationModal.supply.youCanWrapNative"
                components={{
                  Link: <Link href={UNISWAP_URL} />,
                }}
                values={{
                  nativeTokenSymbol: asset.vToken.underlyingToken.tokenWrapped.symbol,
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

        <div className="mb-3">
          {isIntegratedSwapFeatureEnabled || canWrapNativeToken ? (
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
            label={
              isUsingSwap
                ? t('operationModal.supply.walletBalance')
                : t('operationModal.supply.supplyableAmount')
            }
            css={sharedStyles.getRow({ isLast: false })}
          >
            {isUsingSwap
              ? readableFromTokenUserWalletBalanceTokens
              : readableSupplyableFromTokenAmountTokens}
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
          isUsingSwap={isUsingSwap}
          swap={swap}
          formError={formError}
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
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();

  const [formValues, setFormValues] = useState<FormValues>({
    amountTokens: '',
    fromToken: asset.vToken.underlyingToken,
  });

  const nativeTokenGatewayContractAddress = useGetNativeTokenGatewayContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

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

  const canWrapNativeToken = useMemo(
    () => isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped,
    [isWrapUnwrapNativeTokenEnabled, asset.vToken.underlyingToken.tokenWrapped],
  );

  // a user is trying to wrap the chain's native token if
  // 1) the wrap/unwrap feature is enabled
  // 2) the selected form token is the native token
  // 3) the market's underlying token wraps the native token
  const isWrappingNativeToken = useMemo(
    () => canWrapNativeToken && !!formValues.fromToken.isNative,
    [canWrapNativeToken, formValues.fromToken],
  );

  const isUsingSwap = useMemo(
    () =>
      isIntegratedSwapFeatureEnabled &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken),
    [isIntegratedSwapFeatureEnabled, formValues.fromToken, asset.vToken.underlyingToken],
  );

  const swapRouterContractAddress = useGetSwapRouterContractAddress({
    comptrollerContractAddress: pool.comptrollerAddress,
  });

  const spenderAddress = useMemo(() => {
    if (isWrappingNativeToken) {
      return nativeTokenGatewayContractAddress;
    }
    if (isUsingSwap) {
      return swapRouterContractAddress;
    }

    return asset.vToken.address;
  }, [
    isWrappingNativeToken,
    isUsingSwap,
    asset.vToken.address,
    nativeTokenGatewayContractAddress,
    swapRouterContractAddress,
  ]);

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

  const { data: nativeTokenBalanceData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || '',
      token: asset.vToken.underlyingToken.tokenWrapped,
    },
    {
      enabled: isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped,
    },
  );

  const nativeWrappedTokenBalances: TokenBalance[] = useMemo(() => {
    if (asset.vToken.underlyingToken.tokenWrapped && nativeTokenBalanceData) {
      const marketTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken,
        balanceMantissa: convertTokensToMantissa({
          token: asset.vToken.underlyingToken,
          value: asset.userWalletBalanceTokens,
        }),
      };
      const nativeTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken.tokenWrapped,
        balanceMantissa: nativeTokenBalanceData.balanceMantissa,
      };
      return [marketTokenBalance, nativeTokenBalance];
    }
    return [];
  }, [asset.vToken.underlyingToken, asset.userWalletBalanceTokens, nativeTokenBalanceData]);

  const { data: integratedSwapTokenBalancesData } = useGetSwapTokenUserBalances({
    accountAddress,
  });

  const { mutateAsync: supply, isLoading: isSupplyLoading } = useSupply({
    poolName: pool.name,
    vToken: asset.vToken,
  });

  const { mutateAsync: wrapTokensAndSupply, isLoading: isWrapAndSupplyLoading } =
    useWrapTokensAndSupply({
      vToken: asset.vToken,
      poolComptrollerAddress: pool.comptrollerAddress,
    });

  const { mutateAsync: swapExactTokensForTokensAndSupply, isLoading: isSwapAndSupplyLoading } =
    useSwapTokensAndSupply({
      poolName: pool.name,
      poolComptrollerAddress: pool.comptrollerAddress,
      vToken: asset.vToken,
    });

  const isSubmitting = isSupplyLoading || isSwapAndSupplyLoading || isWrapAndSupplyLoading;

  const onSubmit: SupplyFormUiProps['onSubmit'] = useCallback(
    async ({ fromToken, fromTokenAmountTokens, swap }) => {
      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      // Handle supply flow
      if (!isUsingSwap && !isWrappingNativeToken) {
        return supply({ amountMantissa });
      }

      if (isWrappingNativeToken) {
        return wrapTokensAndSupply({
          accountAddress: accountAddress || '',
          amountMantissa,
        });
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
    },
    [
      accountAddress,
      isUsingSwap,
      isWrappingNativeToken,
      supply,
      swapExactTokensForTokensAndSupply,
      wrapTokensAndSupply,
    ],
  );

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
      isWrapUnwrapNativeTokenEnabled={isWrapUnwrapNativeTokenEnabled}
      isIntegratedSwapFeatureEnabled={isIntegratedSwapFeatureEnabled}
      canWrapNativeToken={canWrapNativeToken}
      isWrappingNativeToken={isWrappingNativeToken}
      isUsingSwap={isUsingSwap}
      formValues={formValues}
      setFormValues={setFormValues}
      onCloseModal={onCloseModal}
      nativeWrappedTokenBalances={nativeWrappedTokenBalances}
      integratedSwapTokenBalances={integratedSwapTokenBalancesData}
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

import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import { useSupply, useSwapTokensAndSupply } from 'clients/api';
import {
  Delimiter,
  LabeledInlineContent,
  SelectTokenTextField,
  SpendingLimit,
  Toggle,
  TokenTextField,
} from 'components';
import { useCollateral } from 'hooks/useCollateral';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import useGetSwapInfo from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import { VError, handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress, useAccountChainId, useChainId } from 'libs/wallet';
import type { Asset, BalanceMutation, Pool, Swap, SwapError, TokenBalance } from 'types';
import {
  areTokensEqual,
  convertMantissaToTokens,
  convertTokensToMantissa,
  getSwapToTokenAmountReceivedTokens,
  getUniqueTokenBalances,
  isCollateralActionDisabled,
} from 'utilities';

import { ConnectWallet } from 'containers/ConnectWallet';
import { SwitchChainNotice } from 'containers/SwitchChainNotice';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { useAnalytics } from 'libs/analytics';
import { ApyBreakdown } from '../ApyBreakdown';
import { OperationDetails } from '../OperationDetails';
import { calculateAmountDollars } from '../calculateAmountDollars';
import Notice from './Notice';
import SubmitSection, { type SubmitSectionProps } from './SubmitSection';
import TEST_IDS from './testIds';
import useForm, { type FormValues, type UseFormInput } from './useForm';

export interface SupplyFormUiProps
  extends Pick<
    SubmitSectionProps,
    | 'approveFromToken'
    | 'isApproveFromTokenLoading'
    | 'isFromTokenApproved'
    | 'isFromTokenWalletSpendingLimitLoading'
  > {
  isUserConnected: boolean;
  asset: Asset;
  pool: Pool;
  onSubmit: UseFormInput['onSubmit'];
  isSubmitting: boolean;
  nativeWrappedTokenBalances: TokenBalance[];
  integratedSwapTokenBalances: TokenBalance[];
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  formValues: FormValues;
  isSwapLoading: boolean;
  revokeFromTokenWalletSpendingLimit: () => Promise<unknown>;
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  isIntegratedSwapFeatureEnabled: boolean;
  canWrapNativeToken: boolean;
  isWrappingNativeToken: boolean;
  isUsingSwap: boolean;
  onSubmitSuccess?: () => void;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

export const SupplyFormUi: React.FC<SupplyFormUiProps> = ({
  isUserConnected,
  asset,
  pool,
  onSubmitSuccess,
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
  isIntegratedSwapFeatureEnabled,
  canWrapNativeToken,
  isWrappingNativeToken,
  isUsingSwap,
  swap,
  swapError,
}) => {
  const { t } = useTranslation();
  const { toggleCollateral } = useCollateral();
  const { captureAnalyticEvent } = useAnalytics();

  const tokenBalances = useMemo(
    () => getUniqueTokenBalances(...integratedSwapTokenBalances, ...nativeWrappedTokenBalances),
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

  // Determine the amount of tokens the user can supply, taking the supply cap, their wallet
  // balance and spending limit in consideration
  const limitTokens = useMemo(() => {
    // If user is using swap, we fill the input with the user's wallet balance as we don't have a
    // way to know in advance exactly how much of the fromToken they can supply to
    let amountTokens = new BigNumber(fromTokenUserWalletBalanceTokens || 0);

    // If user has set a spending limit for fromToken, then we take it in consideration
    if (fromTokenWalletSpendingLimitTokens?.isGreaterThan(0)) {
      amountTokens = BigNumber.min(amountTokens, fromTokenWalletSpendingLimitTokens);
    }

    // Take supply cap in consideration, if user is not swapping
    if (!isUsingSwap) {
      const marginWithSupplyCapTokens = asset.supplyCapTokens.isEqualTo(0)
        ? new BigNumber(0)
        : asset.supplyCapTokens.minus(asset.supplyBalanceTokens);

      amountTokens = BigNumber.min(amountTokens, marginWithSupplyCapTokens);
    }

    return amountTokens;
  }, [
    isUsingSwap,
    asset.supplyBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    asset.supplyCapTokens,
  ]);

  const debouncedFormAmountTokens = useDebounceValue(formValues.amountTokens);

  let toTokenAmountTokens = isUsingSwap
    ? getSwapToTokenAmountReceivedTokens(swap)
    : debouncedFormAmountTokens;
  toTokenAmountTokens = new BigNumber(toTokenAmountTokens || 0);

  const balanceMutations: BalanceMutation[] = [
    {
      type: 'asset',
      vTokenAddress: asset.vToken.address,
      action: 'supply',
      amountTokens: toTokenAmountTokens,
    },
  ];

  const { data: getSimulatedPoolData } = useSimulateBalanceMutations({
    pool,
    balanceMutations,
  });
  const simulatedPool = getSimulatedPoolData?.pool;

  const { handleSubmit, isFormValid, formError } = useForm({
    asset,
    fromTokenUserWalletBalanceTokens,
    poolName: pool.name,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    isUsingSwap,
    swap,
    swapError,
    onSubmitSuccess,
    onSubmit,
    formValues,
    setFormValues,
  });

  const readableFromTokenUserWalletBalanceTokens = useFormatTokensToReadableValue({
    value: fromTokenUserWalletBalanceTokens,
    token: formValues.fromToken,
  });

  const { chainId: accountChainId } = useAccountChainId();
  const { chainId } = useChainId();
  const isAccountOnWrongChain = accountChainId !== chainId;
  const isCollateralToggleDisabled = isCollateralActionDisabled({
    disabledTokenActions: asset.disabledTokenActions,
    isCollateralOfUser: asset.isCollateralOfUser,
  });

  const captureAmountSetAnalyticEvent = ({
    amountTokens,
    maxSelected,
  }: { amountTokens: BigNumber | string; maxSelected: boolean }) => {
    if (Number(formValues.amountTokens) > 0) {
      captureAnalyticEvent(
        'supply_amount_set',
        {
          poolName: pool.name,
          assetSymbol: asset.vToken.underlyingToken.symbol,
          usdAmount: calculateAmountDollars({
            amountTokens,
            tokenPriceCents: asset.tokenPriceCents,
          }),
          maxSelected,
        },
        {
          debounced: true,
        },
      );
    }
  };

  const handleToggleCollateral = async () => {
    try {
      await toggleCollateral({
        asset,
        poolName: pool.name,
        comptrollerAddress: pool.comptrollerAddress,
      });
    } catch (error) {
      handleError({ error });
    }
  };

  const handleRightMaxButtonClick = () => {
    captureAmountSetAnalyticEvent({ amountTokens: limitTokens, maxSelected: true });

    setFormValues(currentFormValues => ({
      ...currentFormValues,
      amountTokens: limitTokens.toFixed(),
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {(asset.userCollateralFactor || asset.isCollateralOfUser) && (
          <>
            <SwitchChainNotice />

            <LabeledInlineContent label={t('operationForm.collateral')}>
              <Toggle
                onChange={handleToggleCollateral}
                value={
                  asset.isCollateralOfUser &&
                  (!pool.userEModeGroup || asset.userCollateralFactor > 0)
                }
                disabled={!isUserConnected || isAccountOnWrongChain || isCollateralToggleDisabled}
              />
            </LabeledInlineContent>
          </>
        )}

        {isIntegratedSwapFeatureEnabled || canWrapNativeToken ? (
          <SelectTokenTextField
            data-testid={TEST_IDS.selectTokenTextField}
            selectedToken={formValues.fromToken}
            value={formValues.amountTokens}
            hasError={!isSubmitting && !!formError && Number(formValues.amountTokens) > 0}
            disabled={
              !isUserConnected ||
              isSubmitting ||
              isApproveFromTokenLoading ||
              formError?.code === 'SUPPLY_CAP_ALREADY_REACHED'
            }
            onChange={amountTokens => {
              captureAmountSetAnalyticEvent({ amountTokens, maxSelected: false });

              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
              }));
            }}
            onChangeSelectedToken={fromToken =>
              setFormValues(currentFormValues => ({
                ...currentFormValues,
                fromToken,
              }))
            }
            rightMaxButton={{
              label: t('operationForm.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            tokenBalances={tokenBalances}
            description={
              !isSubmitting && !!formError?.message ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
          />
        ) : (
          <TokenTextField
            data-testid={TEST_IDS.tokenTextField}
            name="amountTokens"
            token={asset.vToken.underlyingToken}
            value={formValues.amountTokens}
            onChange={amountTokens => {
              captureAmountSetAnalyticEvent({ amountTokens, maxSelected: false });

              setFormValues(currentFormValues => ({
                ...currentFormValues,
                amountTokens,
              }));
            }}
            disabled={
              !isUserConnected ||
              isSubmitting ||
              isApproveFromTokenLoading ||
              formError?.code === 'SUPPLY_CAP_ALREADY_REACHED'
            }
            rightMaxButton={{
              label: t('operationForm.rightMaxButtonLabel'),
              onClick: handleRightMaxButtonClick,
            }}
            hasError={
              isUserConnected && !isSubmitting && !!formError && Number(formValues.amountTokens) > 0
            }
            description={
              isUserConnected && !isSubmitting && !!formError?.message ? (
                <p className="text-red">{formError.message}</p>
              ) : undefined
            }
          />
        )}

        {!isUserConnected && <ApyBreakdown pool={pool} balanceMutations={balanceMutations} />}
      </div>

      <ConnectWallet
        className={cn('space-y-4', isUserConnected ? 'mt-2' : 'mt-6')}
        analyticVariant="supply_form"
      >
        <div className="space-y-4">
          {!isSubmitting && !isSwapLoading && !formError && <Notice swap={swap} />}

          <div className="space-y-2">
            <LabeledInlineContent label={t('operationForm.walletBalance')}>
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

          <Delimiter />

          <OperationDetails
            isUsingSwap={isUsingSwap}
            action="supply"
            pool={pool}
            balanceMutations={balanceMutations}
            simulatedPool={simulatedPool}
            swap={swap}
          />
        </div>

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
      </ConnectWallet>
    </form>
  );
};

export interface SupplyFormProps {
  asset: Asset;
  pool: Pool;
  onSubmitSuccess?: () => void;
  userTokenWrappedBalanceMantissa?: BigNumber;
}

const SupplyForm: React.FC<SupplyFormProps> = ({
  asset,
  pool,
  onSubmitSuccess,
  userTokenWrappedBalanceMantissa,
}) => {
  const isWrapUnwrapNativeTokenEnabled = useIsFeatureEnabled({ name: 'wrapUnwrapNativeToken' });
  const isIntegratedSwapEnabled = useIsFeatureEnabled({ name: 'integratedSwap' });
  const { accountAddress } = useAccountAddress();

  const { address: nativeTokenGatewayContractAddress } = useGetContractAddress({
    name: 'NativeTokenGateway',
    poolComptrollerContractAddress: pool.comptrollerAddress,
  });

  const isIntegratedSwapFeatureEnabled = useMemo(
    () =>
      isIntegratedSwapEnabled &&
      // Check swap and supply action is enabled for underlying token
      !asset.disabledTokenActions.includes('swapAndSupply'),
    [asset.disabledTokenActions, isIntegratedSwapEnabled],
  );

  const canWrapNativeToken = useMemo(
    () => isWrapUnwrapNativeTokenEnabled && !!asset.vToken.underlyingToken.tokenWrapped,
    [isWrapUnwrapNativeTokenEnabled, asset.vToken.underlyingToken.tokenWrapped],
  );

  const userWalletNativeTokenBalanceTokens = useMemo(() => {
    return userTokenWrappedBalanceMantissa
      ? convertMantissaToTokens({
          token: asset.vToken.underlyingToken.tokenWrapped,
          value: userTokenWrappedBalanceMantissa,
        })
      : undefined;
  }, [asset.vToken.underlyingToken.tokenWrapped, userTokenWrappedBalanceMantissa]);

  const shouldSelectNativeToken =
    canWrapNativeToken && userWalletNativeTokenBalanceTokens?.gt(asset.userWalletBalanceTokens);

  const initialFormValues: FormValues = useMemo(
    () => ({
      amountTokens: '',
      fromToken:
        shouldSelectNativeToken && asset.vToken.underlyingToken.tokenWrapped
          ? asset.vToken.underlyingToken.tokenWrapped
          : asset.vToken.underlyingToken,
    }),
    [asset, shouldSelectNativeToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when user disconnects their wallet
  useEffect(() => {
    if (!accountAddress) {
      setFormValues(initialFormValues);
    }
  }, [accountAddress, initialFormValues]);

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
      !isWrappingNativeToken &&
      !areTokensEqual(asset.vToken.underlyingToken, formValues.fromToken),
    [
      isIntegratedSwapFeatureEnabled,
      formValues.fromToken,
      asset.vToken.underlyingToken,
      isWrappingNativeToken,
    ],
  );

  const { address: swapRouterContractAddress } = useGetContractAddress({
    name: 'SwapRouter',
    poolComptrollerContractAddress: pool.comptrollerAddress,
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

  const nativeWrappedTokenBalances: TokenBalance[] = useMemo(() => {
    if (asset.vToken.underlyingToken.tokenWrapped && userTokenWrappedBalanceMantissa) {
      const marketTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken,
        balanceMantissa: convertTokensToMantissa({
          token: asset.vToken.underlyingToken,
          value: asset.userWalletBalanceTokens,
        }),
      };
      const nativeTokenBalance: TokenBalance = {
        token: asset.vToken.underlyingToken.tokenWrapped,
        balanceMantissa: userTokenWrappedBalanceMantissa,
      };
      return [marketTokenBalance, nativeTokenBalance];
    }
    return [];
  }, [
    asset.vToken.underlyingToken,
    asset.userWalletBalanceTokens,
    userTokenWrappedBalanceMantissa,
  ]);

  const { data: integratedSwapTokenBalancesData } = useGetSwapTokenUserBalances({
    accountAddress,
  });

  const { mutateAsync: supply, isPending: isSupplyLoading } = useSupply();

  const { mutateAsync: swapExactTokensForTokensAndSupply, isPending: isSwapAndSupplyLoading } =
    useSwapTokensAndSupply({
      poolName: pool.name,
      poolComptrollerAddress: pool.comptrollerAddress,
      vToken: asset.vToken,
    });

  const isSubmitting = isSupplyLoading || isSwapAndSupplyLoading;

  const onSubmit: SupplyFormUiProps['onSubmit'] = useCallback(
    async ({ fromToken, fromTokenAmountTokens, swap }) => {
      const amountMantissa = convertTokensToMantissa({
        value: new BigNumber(fromTokenAmountTokens.trim()),
        token: fromToken,
      });

      // Handle supply flow
      if (!isUsingSwap && !isWrappingNativeToken) {
        return supply({ amountMantissa, poolName: pool.name, vToken: asset.vToken });
      }

      if (isWrappingNativeToken) {
        return supply({
          poolName: pool.name,
          vToken: asset.vToken,
          amountMantissa,
          wrap: true,
          poolComptrollerContractAddress: pool.comptrollerAddress,
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
      isUsingSwap,
      isWrappingNativeToken,
      supply,
      swapExactTokensForTokensAndSupply,
      pool.comptrollerAddress,
      pool.name,
      asset.vToken,
    ],
  );

  const debouncedFormAmountTokens = useDebounceValue(formValues.amountTokens);

  const swapInfo = useGetSwapInfo({
    fromToken: formValues.fromToken,
    fromTokenAmountTokens: debouncedFormAmountTokens,
    toToken: asset.vToken.underlyingToken,
    direction: 'exactAmountIn',
  });

  return (
    <SupplyFormUi
      isUserConnected={!!accountAddress}
      asset={asset}
      pool={pool}
      isIntegratedSwapFeatureEnabled={isIntegratedSwapFeatureEnabled}
      canWrapNativeToken={canWrapNativeToken}
      isWrappingNativeToken={isWrappingNativeToken}
      isUsingSwap={isUsingSwap}
      formValues={formValues}
      setFormValues={setFormValues}
      onSubmitSuccess={onSubmitSuccess}
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

import BigNumber from 'bignumber.js';
import { useState } from 'react';

import {
  useGetBalanceOf,
  useGetPool,
  useWithdrawFromLiquidityHub,
  useWithdrawPositionFromLiquidityHub,
} from 'clients/api';
import { AvailableBalance, SpendingLimit } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import type { Approval } from 'containers/TxFormSubmitButton';
import { useChain } from 'hooks/useChain';
import useDelegateApproval from 'hooks/useDelegateApproval';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import useTokenApproval from 'hooks/useTokenApproval';
import { useAnalytics } from 'libs/analytics';
import { isUserRejectedTxError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { AssetBalanceMutation, LiquidityHub, LiquidityHubBalanceMutation } from 'types';
import {
  areTokensEqual,
  calculateCollateralWithdrawLimits,
  calculateYearlyInterests,
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
  getCombinedApy,
} from 'utilities';
import { calculateAmountDollars } from '../../MarketForm/calculateAmountDollars';
import { type AmountSetInput, Form, type FormValues, initialFormValues } from '../Form';
import type { UseFormValidationInput } from '../Form/useForm/useFormValidation';

export interface WithdrawFormProps {
  liquidityHub: LiquidityHub;
  onSubmitSuccess?: () => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ liquidityHub, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();
  const [formValues, setFormValues] = useState(initialFormValues);
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const { address: collateralGatewayContractAddress } = useGetContractAddress({
    name: 'CollateralGateway',
  });

  const isAutoResupplyEnabled =
    useIsFeatureEnabled({ name: 'liquidityHubAutoResupply' }) && !!collateralGatewayContractAddress;

  const { data: getPoolData } = useGetPool(
    {
      poolComptrollerAddress: corePoolComptrollerContractAddress,
      accountAddress,
    },
    {
      enabled: isAutoResupplyEnabled,
    },
  );

  const corePool = isAutoResupplyEnabled ? getPoolData?.pool : undefined;

  const corePoolVhAsset = corePool?.assets.find(
    asset =>
      areTokensEqual(asset.vToken.underlyingToken, liquidityHub.vhToken) &&
      !asset.disabledTokenActions.includes('withdraw'),
  );

  const { decimals } = liquidityHub.vhToken.underlyingToken;

  // What a share pays out once the Hub redeem fee is taken
  const redeemPricePerShare = liquidityHub.pricePerShare.multipliedBy(
    new BigNumber(1).minus(liquidityHub.redeemFeePercentage.dividedBy(100)),
  );

  const userMaxRedeemTokens = liquidityHub.userVhTokenMaxRedeemTokens
    ?.multipliedBy(redeemPricePerShare)
    .dp(decimals, BigNumber.ROUND_DOWN);

  const userWithdrawCapTokens = liquidityHub.userWithdrawCapTokens?.dp(
    decimals,
    BigNumber.ROUND_DOWN,
  );

  const walletVhTokenApprovalToken = {
    ...liquidityHub.vhToken,
    iconSrc: liquidityHub.vhToken.underlyingToken.iconSrc,
  };

  const { data: getWalletVhTokenBalanceData } = useGetBalanceOf(
    {
      accountAddress: accountAddress || NULL_ADDRESS,
      token: walletVhTokenApprovalToken,
    },
    {
      enabled: !!accountAddress,
    },
  );

  // The indexed balance can lag behind the chain
  const walletVhTokenBalanceTokens = getWalletVhTokenBalanceData
    ? convertMantissaToTokens({
        value: getWalletVhTokenBalanceData.balanceMantissa,
        token: liquidityHub.vhToken,
      })
    : liquidityHub.userVhTokenBalanceTokens ?? new BigNumber(0);

  const walletSupplyBalanceTokens = walletVhTokenBalanceTokens.multipliedBy(redeemPricePerShare);

  const walletRedeemableTokens = walletSupplyBalanceTokens.dp(decimals, BigNumber.ROUND_DOWN);

  const userSupplyBalanceTokens = corePool
    ? walletVhTokenBalanceTokens
        .plus(
          corePool.assets.find(asset =>
            areTokensEqual(asset.vToken.underlyingToken, liquidityHub.vhToken),
          )?.userSupplyBalanceTokens ?? 0,
        )
        .multipliedBy(liquidityHub.pricePerShare)
    : undefined;

  const userSupplyBalanceCents = userSupplyBalanceTokens?.multipliedBy(
    liquidityHub.tokenPriceCents,
  );

  // The position is read on chain once part of it sits in Core
  const formLiquidityHub: LiquidityHub = isAutoResupplyEnabled
    ? {
        ...liquidityHub,
        userVhTokenBalanceTokens: walletVhTokenBalanceTokens,
        userSupplyBalanceTokens,
        userSupplyBalanceCents,
        userYearlyEarningsCents:
          userSupplyBalanceCents &&
          calculateYearlyInterests({
            balance: userSupplyBalanceCents,
            interestPercentage: getCombinedApy({
              type: 'supply',
              baseApyPercentage: liquidityHub.supplyApyPercentage,
              tokenDistributions: liquidityHub.supplyTokenDistributions,
            }).totalApyPercentage,
          }),
      }
    : liquidityHub;

  const walletLimitTokens = BigNumber.min(
    userWithdrawCapTokens ?? walletRedeemableTokens,
    userMaxRedeemTokens ?? walletRedeemableTokens,
    walletRedeemableTokens,
  );

  const coreLimits =
    corePool && corePoolVhAsset
      ? calculateCollateralWithdrawLimits({ asset: corePoolVhAsset, pool: corePool })
      : undefined;

  const hubLimitTokens = BigNumber.min(
    liquidityHub.liquidityTokens,
    liquidityHub.withdrawCapTokens,
  );

  const getPositionLimitTokens = (coreLimitVhTokens: BigNumber) =>
    BigNumber.min(
      walletSupplyBalanceTokens.plus(coreLimitVhTokens.multipliedBy(redeemPricePerShare)),
      hubLimitTokens,
    ).dp(decimals, BigNumber.ROUND_DOWN);

  const limitTokens = coreLimits
    ? getPositionLimitTokens(coreLimits.limitTokens)
    : walletLimitTokens;

  const safeLimitTokens = coreLimits
    ? getPositionLimitTokens(coreLimits.safeLimitTokens)
    : undefined;

  const fromAmountTokens = formValues.amountTokens
    ? new BigNumber(formValues.amountTokens)
    : undefined;

  const amountVhTokens = (fromAmountTokens ?? new BigNumber(0)).dividedBy(redeemPricePerShare);

  const coreWithdrawalVhTokens = corePoolVhAsset
    ? BigNumber.max(amountVhTokens.minus(walletVhTokenBalanceTokens), 0).dp(
        liquidityHub.vhToken.decimals,
        BigNumber.ROUND_UP,
      )
    : new BigNumber(0);

  const isWithdrawingFromCore = coreWithdrawalVhTokens.isGreaterThan(0);

  const approvals: Approval[] = [];

  const isPullingWalletVhTokens =
    isWithdrawingFromCore &&
    !!collateralGatewayContractAddress &&
    walletVhTokenBalanceTokens.isGreaterThan(0);

  if (isPullingWalletVhTokens && collateralGatewayContractAddress) {
    approvals.push({
      type: 'token',
      token: walletVhTokenApprovalToken,
      spenderAddress: collateralGatewayContractAddress,
    });
  }

  const {
    walletSpendingLimitTokens: walletVhTokenSpendingLimitTokens,
    revokeWalletSpendingLimit,
    isRevokeWalletSpendingLimitLoading,
  } = useTokenApproval({
    token: walletVhTokenApprovalToken,
    spenderAddress: collateralGatewayContractAddress ?? NULL_ADDRESS,
    accountAddress,
  });

  // A partial allowance skips the approval step
  const isAboveWalletVhTokenSpendingLimit =
    isPullingWalletVhTokens &&
    !!walletVhTokenSpendingLimitTokens?.isGreaterThan(0) &&
    walletVhTokenSpendingLimitTokens.isLessThan(walletVhTokenBalanceTokens);

  const validateForm: UseFormValidationInput['validate'] = () => {
    if (isAboveWalletVhTokenSpendingLimit) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('liquidityHubForm.error.higherThanWalletSpendingLimit'),
      };
    }
  };

  if (isWithdrawingFromCore && collateralGatewayContractAddress) {
    approvals.push({
      type: 'delegate',
      delegateeAddress: collateralGatewayContractAddress,
      poolComptrollerContractAddress: corePoolComptrollerContractAddress,
    });
  }

  // Without the grant, the gateway silently skips the Core leg
  const { isDelegateApprovedLoading } = useDelegateApproval({
    delegateeAddress: collateralGatewayContractAddress ?? NULL_ADDRESS,
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    enabled: isWithdrawingFromCore && !!collateralGatewayContractAddress,
  });

  const { mutateAsync: withdrawFromLiquidityHub, isPending: isWithdrawFromLiquidityHubLoading } =
    useWithdrawFromLiquidityHub();
  const {
    mutateAsync: withdrawPositionFromLiquidityHub,
    isPending: isWithdrawPositionFromLiquidityHubLoading,
  } = useWithdrawPositionFromLiquidityHub();
  const isSubmitting =
    isWithdrawFromLiquidityHubLoading || isWithdrawPositionFromLiquidityHubLoading;

  const getAnalyticData = (amountTokens: BigNumber | string) => ({
    poolName: 'liquidity_hub',
    assetSymbol: liquidityHub.vhToken.underlyingToken.symbol,
    usdAmount: calculateAmountDollars({
      amountTokens,
      tokenPriceCents: liquidityHub.tokenPriceCents,
    }),
  });

  const captureAmountSetAnalyticEvent = ({ amountTokens, maxSelected }: AmountSetInput) => {
    if (Number(amountTokens) <= 0) {
      return;
    }

    captureAnalyticEvent(
      'withdraw_amount_set',
      {
        ...getAnalyticData(amountTokens),
        maxSelected,
      },
      {
        debounced: true,
      },
    );
  };

  const handleSubmit = async (submittedFormValues: FormValues) => {
    const amountTokens = new BigNumber(submittedFormValues.amountTokens);
    const amountMantissa = convertTokensToMantissa({
      token: liquidityHub.vhToken.underlyingToken,
      value: amountTokens,
    });

    // Redeem every wallet share only when the amount covers the live balance
    const withdrawFullSupply =
      walletRedeemableTokens.isGreaterThan(0) &&
      amountTokens.isGreaterThanOrEqualTo(walletRedeemableTokens) &&
      (!userMaxRedeemTokens || walletRedeemableTokens.isLessThanOrEqualTo(userMaxRedeemTokens));

    const userVhTokenBalanceMantissa = convertTokensToMantissa({
      token: liquidityHub.vhToken,
      value: walletVhTokenBalanceTokens,
    });

    const analyticData = getAnalyticData(amountTokens);

    const positionBalanceTokens = walletSupplyBalanceTokens.plus(
      (corePoolVhAsset?.userSupplyBalanceTokens ?? new BigNumber(0)).multipliedBy(
        redeemPricePerShare,
      ),
    );

    try {
      captureAnalyticEvent('withdraw_initiated', analyticData);

      if (corePoolVhAsset && isWithdrawingFromCore) {
        await withdrawPositionFromLiquidityHub({
          liquidityHub,
          vhMarketVToken: corePoolVhAsset.vToken,
          amountMantissa,
          sharesMantissa: convertTokensToMantissa({
            token: liquidityHub.vhToken,
            value: amountTokens
              .dividedBy(redeemPricePerShare)
              .dp(liquidityHub.vhToken.decimals, BigNumber.ROUND_UP),
          }),
          withdrawFullPosition: amountTokens.isGreaterThanOrEqualTo(
            positionBalanceTokens.dp(decimals, BigNumber.ROUND_DOWN),
          ),
        });
      } else {
        await withdrawFromLiquidityHub({
          liquidityHub,
          amountMantissa,
          withdrawFullSupply,
          userVhTokenBalanceMantissa,
        });
      }

      captureAnalyticEvent('withdraw_signed', analyticData);
    } catch (error) {
      if (isUserRejectedTxError({ error })) {
        captureAnalyticEvent('withdraw_rejected', analyticData);
      }

      throw error;
    }
  };

  const balanceMutations: Array<AssetBalanceMutation | LiquidityHubBalanceMutation> = [
    {
      type: 'liquidityHub',
      vhTokenAddress: liquidityHub.vhToken.address,
      amountTokens: fromAmountTokens || new BigNumber(0),
      action: 'withdraw',
    },
  ];

  if (corePoolVhAsset && isWithdrawingFromCore) {
    balanceMutations.push({
      type: 'asset',
      vTokenAddress: corePoolVhAsset.vToken.address,
      action: 'withdraw',
      amountTokens: coreWithdrawalVhTokens,
    });
  }

  const handleLimitClick = limitTokens.isGreaterThan(0)
    ? () => {
        const amountTokens = limitTokens
          .dp(liquidityHub.vhToken.underlyingToken.decimals)
          .toFixed();

        captureAmountSetAnalyticEvent({
          amountTokens,
          maxSelected: true,
        });

        setFormValues(values => ({
          ...values,
          amountTokens,
        }));
      }
    : undefined;

  const readableLimit = formatTokensToReadableValue({
    value: limitTokens,
    token: liquidityHub.vhToken.underlyingToken,
  });

  const availableBalanceDom = (
    <div className="space-y-2">
      <AvailableBalance readableBalance={readableLimit} onClick={handleLimitClick} />

      {isPullingWalletVhTokens && (
        <SpendingLimit
          token={liquidityHub.vhToken.underlyingToken}
          walletBalanceTokens={walletSupplyBalanceTokens}
          walletSpendingLimitTokens={walletVhTokenSpendingLimitTokens?.multipliedBy(
            liquidityHub.pricePerShare,
          )}
          onRevoke={revokeWalletSpendingLimit}
          isRevokeLoading={isRevokeWalletSpendingLimitLoading}
        />
      )}
    </div>
  );

  return (
    <Form
      isSubmitting={isSubmitting}
      liquidityHub={formLiquidityHub}
      onSubmit={handleSubmit}
      onSubmitSuccess={onSubmitSuccess}
      balanceMutations={balanceMutations}
      formValues={formValues}
      setFormValues={setFormValues}
      submitButtonLabel={t('liquidityHubForm.withdrawSubmitButtonLabel')}
      limitTokens={limitTokens}
      safeLimitTokens={safeLimitTokens}
      rightMaxButtonLabel={
        safeLimitTokens ? t('liquidityHubForm.rightSafeMaxButtonLabel') : undefined
      }
      approval={approvals}
      isApprovalLoading={isWithdrawingFromCore && isDelegateApprovedLoading}
      includeCorePool={
        !!corePoolVhAsset?.isCollateralOfUser &&
        corePoolVhAsset.userSupplyBalanceTokens.isGreaterThan(0)
      }
      availableBalance={availableBalanceDom}
      validateForm={validateForm}
      onAmountSet={captureAmountSetAnalyticEvent}
    />
  );
};

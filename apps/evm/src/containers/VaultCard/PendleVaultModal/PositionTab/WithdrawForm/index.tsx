import BigNumber from 'bignumber.js';

import {
  useGetPendleSwapQuote,
  useGetVTokenBalance,
  useWithdrawAtMaturityFromPendleVault,
  useWithdrawFromPendleVault,
} from 'clients/api';
import { NoticeInfo } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { VaultForm } from 'containers/VaultForm';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useNow } from 'hooks/useNow';
import { useVaultForm } from 'hooks/useVaultForm';
import { useTranslation } from 'libs/translations';
import type { PendleVault } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';

import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { VError } from 'libs/errors';
import { useAccountAddress } from 'libs/wallet';
import { useEffect, useMemo } from 'react';
import type { PendleVaultAction } from '../../types';
import { Footer } from '../Footer';

export interface WithdrawFormProps {
  vault: PendleVault;
  onClose: () => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ vault, onClose }) => {
  const { accountAddress } = useAccountAddress();
  const { t } = useTranslation();
  const now = useNow();

  const { address: pendlePtVaultAddress } = useGetContractAddress({ name: 'PendlePtVault' });

  const hasMatured = !!vault.maturityDate && now.getTime() > vault.maturityDate.getTime();

  const actionMode: PendleVaultAction = hasMatured ? 'redeemAtMaturity' : 'withdraw';

  const fromToken = vault.rewardToken;
  const toToken = vault.stakedToken;
  const fromTokenPriceCents = vault.rewardTokenPriceCents;

  const userStakedTokens = useMemo(
    () =>
      vault.userStakeBalanceMantissa &&
      convertMantissaToTokens({
        value: vault.userStakeBalanceMantissa,
        token: vault.asset.vToken.underlyingToken,
      }),
    [vault.userStakeBalanceMantissa, vault.asset],
  );

  const limitFromTokens = new BigNumber(userStakedTokens ?? 0);

  const form = useVaultForm({
    limitFromTokens,
    fromToken,
  });

  useEffect(() => {
    if (hasMatured && userStakedTokens) {
      form.setValue('fromAmountTokens', userStakedTokens.toFixed(), {
        shouldValidate: true,
      });
    }
  }, [form.setValue, userStakedTokens, hasMatured]);

  const fromAmountTokensFieldValue = form.watch('fromAmountTokens') ?? '0';
  const debouncedFromAmountTokens = useDebounceValue(fromAmountTokensFieldValue);
  const fromAmountTokens = new BigNumber(debouncedFromAmountTokens);

  const { userSlippageTolerancePercentage } = useGetUserSlippageTolerance();

  const {
    data: swapQuote,
    error: swapQuoteError,
    isLoading: isGetSwapQuoteLoading,
  } = useGetPendleSwapQuote(
    {
      fromToken,
      toToken,
      amountTokens: fromAmountTokens,
      slippagePercentage: userSlippageTolerancePercentage,
    },
    {
      enabled:
        !hasMatured && fromAmountTokens.isGreaterThan(0) && fromAmountTokens.lte(limitFromTokens),
    },
  );

  const { mutateAsync: withdraw } = useWithdrawFromPendleVault({
    pendleMarketAddress: vault.venueAddress ?? NULL_ADDRESS,
  });
  const { mutateAsync: withdrawAtMaturity } = useWithdrawAtMaturityFromPendleVault({
    pendleMarketAddress: vault.venueAddress ?? NULL_ADDRESS,
  });

  const { data: getUserVTokenBalanceData, isLoading: isGetUserVTokenBalanceLoading } =
    useGetVTokenBalance(
      {
        accountAddress: accountAddress ?? NULL_ADDRESS,
        vTokenAddress: vault.asset.vToken.address,
      },
      {
        enabled: !!accountAddress && hasMatured,
      },
    );
  const userVTokenBalanceMantissa = getUserVTokenBalanceData?.balanceMantissa;

  const estimatedReceivedTokens = swapQuote?.estimatedReceivedTokensMantissa
    ? convertMantissaToTokens({
        value: swapQuote.estimatedReceivedTokensMantissa,
        token: toToken,
      })
    : undefined;

  const estDiffAmount = estimatedReceivedTokens?.minus(fromAmountTokens);

  const estDiffAmountReadable =
    actionMode === 'redeemAtMaturity'
      ? formatTokensToReadableValue({
          value: new BigNumber(0),
          token: toToken,
        })
      : estDiffAmount
        ? `≈ ${formatTokensToReadableValue({
            value: estDiffAmount.negated(),
            token: toToken,
          })}`
        : PLACEHOLDER_KEY;

  const handleSubmit = async () => {
    const currentFromAmountTokens = new BigNumber(fromAmountTokensFieldValue);
    const withdrawFull = currentFromAmountTokens.isEqualTo(limitFromTokens);

    // A full redeem needs the exact vToken balance, while a partial redeem (redeemUnderlying) needs
    // the amount expressed in the underlying token's decimals
    const amountMantissa = withdrawFull
      ? userVTokenBalanceMantissa
      : convertTokensToMantissa({
          value: new BigNumber(fromAmountTokensFieldValue),
          token: vault.asset.vToken,
        });

    if (!amountMantissa) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    if (hasMatured) {
      await withdrawAtMaturity({
        fromToken,
        toToken,
        amountMantissa,
        vToken: vault.asset.vToken,
      });

      onClose();

      return;
    }

    if (!swapQuote) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    await withdraw({
      swapQuote,
      fromToken,
      toToken,
      amountMantissa,
      vToken: vault.asset.vToken,
    });

    onClose();
  };

  const isLoading = isGetSwapQuoteLoading || (hasMatured && isGetUserVTokenBalanceLoading);

  return (
    <div className="space-y-4">
      <VaultForm
        onSubmit={handleSubmit}
        form={form}
        fromToken={fromToken}
        limitFromTokens={limitFromTokens}
        fromTokenFieldLabel={t('vault.modals.withdraw')}
        submitButtonLabel={t('vault.modals.withdraw')}
        fromTokenPriceCents={fromTokenPriceCents.toNumber()}
        swapQuote={swapQuote}
        swapQuoteError={swapQuoteError ?? undefined}
        swapFromToken={!hasMatured ? fromToken : undefined}
        swapToToken={!hasMatured ? toToken : undefined}
        isLoading={isLoading}
        vaultPoolComptrollerContractAddress={vault.poolComptrollerContractAddress}
        disableFromAmountInput={hasMatured}
        delegateeAddress={pendlePtVaultAddress}
        footer={
          <Footer
            actionMode={actionMode}
            vault={vault}
            fromToken={fromToken}
            toToken={toToken}
            userStakedTokens={userStakedTokens}
            userSlippageTolerancePercentage={userSlippageTolerancePercentage}
            swapQuote={swapQuote}
            estDiffAmountReadable={!hasMatured ? estDiffAmountReadable : undefined}
          />
        }
      />

      {!!accountAddress && !hasMatured && (
        <NoticeInfo description={t('vault.modals.maturityPendleDisclaimer')} />
      )}
    </div>
  );
};

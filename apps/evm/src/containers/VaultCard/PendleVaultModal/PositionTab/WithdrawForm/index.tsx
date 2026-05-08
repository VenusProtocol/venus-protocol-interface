import BigNumber from 'bignumber.js';

import { useGetPendleSwapQuote, useWithdraw, useWithdrawFromPendleVault } from 'clients/api';
import { NoticeInfo } from 'components';
import { NULL_ADDRESS } from 'constants/address';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { Link } from 'containers/Link';
import { TransactionForm } from 'containers/VaultCard/TransactionForm';
import { useForm } from 'containers/VaultCard/useForm';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetUserSlippageTolerance } from 'hooks/useGetUserSlippageTolerance';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import type { PendleVault } from 'types';
import {
  convertMantissaToTokens,
  convertTokensToMantissa,
  formatTokensToReadableValue,
} from 'utilities';

import { VError } from 'libs/errors';
import { useAccountAddress } from 'libs/wallet';
import type { PendleVaultAction } from '../../types';
import { Footer } from '../Footer';

const PENDLE_SITE_URL =
  'https://app.pendle.finance/trade/dashboard/overview/positions?timeframe=allTime';

export interface WithdrawFormProps {
  vault: PendleVault;
  onClose: () => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ vault, onClose }) => {
  const { accountAddress } = useAccountAddress();
  const { t, Trans } = useTranslation();
  const now = useNow();

  const hasMatured = !!vault.maturityDate && now.getTime() > vault.maturityDate.getTime();

  const actionMode: PendleVaultAction = hasMatured ? 'redeemAtMaturity' : 'withdraw';

  const fromToken = vault.rewardToken;
  const toToken = vault.stakedToken;
  const fromTokenPriceCents = vault.rewardTokenPriceCents;

  const userStakedTokens = convertMantissaToTokens({
    value: vault.userStakedMantissa ?? new BigNumber(0),
    token: vault.asset.vToken.underlyingToken,
  });

  const limitFromTokens = userStakedTokens;

  const form = useForm({
    limitFromTokens,
  });

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
    pendleMarketAddress: swapQuote?.pendleMarketAddress ?? NULL_ADDRESS,
  });

  const { mutateAsync: withdrawAfterMaturity } = useWithdraw();

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
    const withdrawFull = fromAmountTokensFieldValue === limitFromTokens.toFixed();

    const amountMantissa = convertTokensToMantissa({
      value: new BigNumber(withdrawFull ? userStakedTokens : fromAmountTokensFieldValue),
      token: vault.asset.vToken,
    });

    if (!hasMatured && !swapQuote) {
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    if (hasMatured) {
      await withdrawAfterMaturity({
        poolName: vault.poolName,
        poolComptrollerContractAddress: vault.poolComptrollerContractAddress,
        vToken: vault.asset.vToken,
        withdrawFullSupply: withdrawFull,
        unwrap: fromToken.isNative,
        amountMantissa,
      });
    } else if (swapQuote) {
      await withdraw({
        swapQuote,
        type: 'withdraw',
        fromToken,
        toToken,
        amountMantissa,
        vToken: vault.asset.vToken,
      });
    }

    onClose();
  };

  return (
    <div className="space-y-4">
      <TransactionForm
        onSubmit={handleSubmit}
        form={form}
        fromToken={fromToken}
        limitFromTokens={limitFromTokens}
        fromTokenFieldLabel={t('vault.modals.withdraw')}
        submitButtonLabel={t('vault.modals.withdraw')}
        fromTokenPriceCents={fromTokenPriceCents.toNumber()}
        swapQuote={swapQuote}
        swapQuoteError={swapQuoteError ?? undefined}
        swapFromToken={actionMode !== 'redeemAtMaturity' ? fromToken : undefined}
        swapToToken={actionMode !== 'redeemAtMaturity' ? toToken : undefined}
        isLoading={isGetSwapQuoteLoading}
        footer={
          <Footer
            actionMode={actionMode}
            vault={vault}
            fromToken={fromToken}
            toToken={toToken}
            userStakedTokens={userStakedTokens}
            userSlippageTolerancePercentage={userSlippageTolerancePercentage}
            swapQuote={swapQuote}
            estDiffAmountReadable={estDiffAmountReadable}
          />
        }
      />

      {!!accountAddress && (
        <NoticeInfo
          description={
            hasMatured ? (
              <Trans
                i18nKey="vault.modals.afterMaturityPendleDisclaimer"
                components={{
                  Link: <Link href={PENDLE_SITE_URL} />,
                }}
              />
            ) : (
              t('vault.modals.maturityPendleDisclaimer')
            )
          }
        />
      )}
    </div>
  );
};

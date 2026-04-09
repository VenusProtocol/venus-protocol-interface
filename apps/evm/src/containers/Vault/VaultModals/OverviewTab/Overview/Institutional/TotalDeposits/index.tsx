import { ProgressCircle } from 'components';
import { useTranslation } from 'libs/translations';
import type { InstitutionalVault } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

interface TotalDepositsProps {
  vault: InstitutionalVault;
}

export const TotalDeposits: React.FC<TotalDepositsProps> = ({ vault }) => {
  const { t } = useTranslation();

  const totalDepositedTokens = convertMantissaToTokens({
    value: vault.totalDepositedMantissa,
    token: vault.stakedToken,
  });

  const maxDepositedTokens = convertMantissaToTokens({
    value: vault.maxDepositedMantissa,
    token: vault.stakedToken,
  });

  const depositPercentage = vault.maxDepositedMantissa.isGreaterThan(0)
    ? vault.totalDepositedMantissa.times(100).div(vault.maxDepositedMantissa).toNumber()
    : 0;

  const totalDepositedCents = totalDepositedTokens.times(vault.stakedTokenPriceCents);
  const maxDepositedCents = maxDepositedTokens.times(vault.stakedTokenPriceCents);

  const readableTotalDepositedCents = formatCentsToReadableValue({ value: totalDepositedCents });
  const readableMaxDepositedCents = formatCentsToReadableValue({ value: maxDepositedCents });

  const readableTotalDepositedTokens = formatTokensToReadableValue({
    value: totalDepositedTokens,
    token: vault.stakedToken,
    addSymbol: false,
  });

  const readableMaxDepositedTokens = formatTokensToReadableValue({
    value: maxDepositedTokens,
    token: vault.stakedToken,
  });

  return (
    <div>
      <p className="text-p2s text-white pb-4">{t('vault.modals.overview.totalDeposits')}</p>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex items-center justify-center shrink-0">
          <ProgressCircle value={depositPercentage} sizePx={72} strokeWidthPx={6} />
          <span className="absolute text-b1s text-white">
            {formatPercentageToReadableValue(depositPercentage)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-b2r text-grey">{t('vault.modals.overview.totalStaked')}</span>
          <span className="text-b1s text-white">
            {readableTotalDepositedCents} / {readableMaxDepositedCents}
          </span>
          <span className="text-b2r text-grey">
            {readableTotalDepositedTokens} / {readableMaxDepositedTokens}
          </span>
        </div>
      </div>
    </div>
  );
};

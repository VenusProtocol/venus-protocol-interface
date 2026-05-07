import { CapProgressCircle } from 'components';
import { useTranslation } from 'libs/translations';
import type { InstitutionalVault } from 'types';
import { convertMantissaToTokens } from 'utilities';

export const TotalDeposits: React.FC<{ vault: InstitutionalVault }> = ({ vault }) => {
  const { t } = useTranslation();

  const stakeBalanceTokens = convertMantissaToTokens({
    value: vault.stakeBalanceMantissa,
    token: vault.stakedToken,
  });
  const maxDepositedTokens = convertMantissaToTokens({
    value: vault.stakeLimitMantissa,
    token: vault.stakedToken,
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-p2s text-white">{t('vault.modals.overview.totalDeposited')}</p>

      <CapProgressCircle
        title={t('vault.modals.overview.totalDeposited')}
        token={vault.stakedToken}
        tokenPriceCents={vault.stakedTokenPriceCents}
        valueTokens={stakeBalanceTokens}
        limitTokens={maxDepositedTokens}
      />
    </div>
  );
};

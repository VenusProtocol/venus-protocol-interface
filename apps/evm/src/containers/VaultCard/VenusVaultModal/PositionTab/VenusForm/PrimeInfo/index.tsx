import type BigNumber from 'bignumber.js';

import PrimeLogo from 'assets/img/primeLogo.svg?react';
import type { GetPrimeStatusOutput } from 'clients/api/queries/getPrimeStatus';
import type { GetPrimeTokenOutput } from 'clients/api/queries/getPrimeToken';
import { ProgressBar } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { convertMantissaToTokens, formatTokensToReadableValue } from 'utilities';

export interface PrimeInfoProps {
  stakedToken: Token;
  userStakedTokens: BigNumber;
  primeTokenData?: GetPrimeTokenOutput;
  primeStatusData?: GetPrimeStatusOutput;
  poolIndex?: number;
}

export const PrimeInfo: React.FC<PrimeInfoProps> = ({
  stakedToken,
  userStakedTokens,
  primeTokenData,
  primeStatusData,
  poolIndex,
}) => {
  const { Trans, t } = useTranslation();
  const isPrimeCalculatorEnabled = useIsFeatureEnabled({ name: 'primeCalculator' });

  if (!primeStatusData) {
    return null;
  }

  // Only show for the correct XVS vault pool
  if (
    typeof poolIndex === 'number' &&
    primeStatusData.xvsVaultPoolId !== poolIndex
  ) {
    return null;
  }

  // If user already has Prime, don't show the banner
  if (primeTokenData?.exists) {
    return null;
  }

  const minStakedMantissa = primeStatusData.primeMinimumStakedXvsMantissa;
  const userStakedMantissa = userStakedTokens.shiftedBy(stakedToken.decimals);
  const stakeDeltaMantissa = minStakedMantissa.minus(userStakedMantissa);

  // If user already meets the threshold, don't show
  if (stakeDeltaMantissa.isLessThanOrEqualTo(0)) {
    return null;
  }

  const minStakedTokens = convertMantissaToTokens({
    value: minStakedMantissa,
    token: stakedToken,
  });

  const stakeDeltaTokens = convertMantissaToTokens({
    value: stakeDeltaMantissa,
    token: stakedToken,
  });

  const readableStakeDelta = formatTokensToReadableValue({
    value: stakeDeltaTokens,
    token: stakedToken,
  });

  const claimWaitingPeriodDays = Math.ceil(
    primeStatusData.claimWaitingPeriodSeconds / (60 * 60 * 24),
  );

  const progressPercentage = minStakedTokens.isGreaterThan(0)
    ? Math.min(
        100,
        userStakedTokens.multipliedBy(100).div(minStakedTokens).dp(0).toNumber(),
      )
    : 0;

  const readableUserStaked = formatTokensToReadableValue({
    value: userStakedTokens,
    token: stakedToken,
  });

  const readableMinStaked = formatTokensToReadableValue({
    value: minStakedTokens,
    token: stakedToken,
  });

  return (
    <div className="border border-lightGrey rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-x-2">
        <PrimeLogo className="size-5 shrink-0" />
        <span className="text-b1s text-white">{t('vault.venusModal.primeQualificationsLabel')}</span>
      </div>

      <p className="text-b2r text-light-grey">
        <Trans
          i18nKey="vault.venusModal.primeStakeMessage"
          values={{
            amount: readableStakeDelta,
            days: claimWaitingPeriodDays,
          }}
          components={{
            Link: isPrimeCalculatorEnabled ? (
              <Link to={routes.primeCalculator.path} className="text-blue" />
            ) : (
              <span className="text-blue" />
            ),
          }}
        />
      </p>

      <ProgressBar
        value={progressPercentage}
        step={1}
        min={0}
        max={100}
        ariaLabel={t('vault.venusModal.primeQualificationsLabel')}
      />

      <p className="text-b2r text-light-grey">
        {t('vault.venusModal.primeQualification', {
          current: readableUserStaked,
          target: readableMinStaked,
        })}
      </p>
    </div>
  );
};

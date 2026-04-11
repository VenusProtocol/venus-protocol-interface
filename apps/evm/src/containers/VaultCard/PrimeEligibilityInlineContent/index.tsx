import { LabeledInlineContent } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { formatWaitingPeriod } from 'containers/PrimeStatusBanner/formatWaitingPeriod';
import { useGetUserPrimeInfo } from 'hooks/useGetUserPrimeInfo';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';
import { clampToZero, formatTokensToReadableValue } from 'utilities';
import { Progress } from '../Progress';

export interface PrimeEligibilityInlineContentProps {
  className?: string;
}

export const PrimeEligibilityInlineContent: React.FC<PrimeEligibilityInlineContentProps> = ({
  ...otherProps
}) => {
  const { t, Trans, language } = useTranslation();
  const { accountAddress } = useAccountAddress();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: {
      isUserPrime,
      userStakedXvsTokens,
      minXvsToStakeForPrimeTokens,
      claimWaitingPeriodSeconds,
      userClaimTimeRemainingSeconds,
    },
  } = useGetUserPrimeInfo({ accountAddress });

  const stakeDeltaTokens = clampToZero({
    value: minXvsToStakeForPrimeTokens.minus(userStakedXvsTokens),
  });

  const readableStakeDeltaTokens = formatTokensToReadableValue({
    value: stakeDeltaTokens,
    token: xvs,
  });

  const readableClaimWaitingPeriod =
    claimWaitingPeriodSeconds &&
    formatWaitingPeriod({
      waitingPeriodSeconds: claimWaitingPeriodSeconds,
      locale: language.locale,
    });

  const tooltip = useMemo(() => {
    if (userClaimTimeRemainingSeconds === undefined) {
      return;
    }

    const userNeedsToDepositMore = stakeDeltaTokens.isGreaterThan(0);
    const userNeedsToWait = userClaimTimeRemainingSeconds > 0;

    // User needs to stake more XVS then wait
    if (userNeedsToDepositMore && userNeedsToWait) {
      return (
        <Trans
          i18nKey="primeStatusBanner.description.primeCalculator"
          components={{
            WhiteText: <span className="text-white font-semibold" />,
            Link: <Link to={routes.primeCalculator.path} onClick={e => e.stopPropagation()} />,
          }}
          values={{
            stakeDelta: readableStakeDeltaTokens,
            claimWaitingPeriod: readableClaimWaitingPeriod,
          }}
        />
      );
    }

    // User needs to wait
    if (!userNeedsToDepositMore && userNeedsToWait) {
      const readableUserClaimTimeRemaining = formatWaitingPeriod({
        waitingPeriodSeconds: userClaimTimeRemainingSeconds,
        locale: language.locale,
      });

      return t('primeStatusBanner.waitForPrimeTitle', {
        claimWaitingPeriod: readableUserClaimTimeRemaining,
      });
    }

    // User is eligible to claim a Prime token
    if (!userNeedsToDepositMore && !userNeedsToWait) {
      return t('primeStatusBanner.becomePrimeTitle');
    }
  }, [
    Trans,
    t,
    language.locale,
    stakeDeltaTokens,
    readableClaimWaitingPeriod,
    readableStakeDeltaTokens,
    userClaimTimeRemainingSeconds,
  ]);

  if (isUserPrime || !xvs) {
    return undefined;
  }

  return (
    <LabeledInlineContent
      label={t('vault.card.primeEligibility')}
      tooltip={tooltip}
      labelClassName="mb-auto"
    >
      <Progress
        amountTokens={userStakedXvsTokens}
        maxTokens={minXvsToStakeForPrimeTokens}
        token={xvs}
        {...otherProps}
      />
    </LabeledInlineContent>
  );
};

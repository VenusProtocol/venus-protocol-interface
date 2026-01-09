import type BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { cn } from '@venusprotocol/ui';
import PrimeLogo from 'assets/img/primeLogo.svg?react';
import { useClaimPrimeToken } from 'clients/api';
import { Card, PrimaryButton, ProgressBar } from 'components';
import { PRIME_DOC_URL } from 'constants/prime';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useNavigate } from 'hooks/useNavigate';
import { handleError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import { useGetUserPrimeInfo } from 'hooks/useGetUserPrimeInfo';
import { useAccountAddress } from 'libs/wallet';
import { formatPercentageToReadableValue, formatTokensToReadableValue } from 'utilities';
import NoPrimeTokensLeftWarning from './NoPrimeTokensLeftWarning';
import PrimeTokensLeft from './PrimeTokensLeft';
import { formatWaitingPeriod } from './formatWaitingPeriod';
import TEST_IDS from './testIds';

export interface PrimeStatusBannerUiProps {
  xvs: Token;
  claimedPrimeTokenCount: number;
  primeTokenLimit: number;
  isClaimPrimeTokenLoading: boolean;
  onClaimPrimeToken: () => Promise<unknown>;
  onRedirectToXvsVaultPage: () => void;
  userStakedXvsTokens: BigNumber;
  minXvsToStakeForPrimeTokens: BigNumber;
  highestPrimeSimulationApyBoostPercentage: BigNumber | undefined;
  primeClaimWaitingPeriodSeconds: number;
  userPrimeClaimWaitingPeriodSeconds: number;
  hidePromotionalTitle?: boolean;
  className?: string;
}

export const PrimeStatusBannerUi: React.FC<PrimeStatusBannerUiProps> = ({
  className,
  xvs,
  claimedPrimeTokenCount,
  primeTokenLimit,
  isClaimPrimeTokenLoading,
  highestPrimeSimulationApyBoostPercentage,
  primeClaimWaitingPeriodSeconds,
  userPrimeClaimWaitingPeriodSeconds,
  minXvsToStakeForPrimeTokens,
  userStakedXvsTokens,
  hidePromotionalTitle = false,
  onClaimPrimeToken,
  onRedirectToXvsVaultPage,
}) => {
  const { Trans, t } = useTranslation();
  const last5Percent = primeTokenLimit * 0.05;
  const primeTokensLeft = primeTokenLimit - claimedPrimeTokenCount;
  const haveAllPrimeTokensBeenClaimed = primeTokensLeft <= 0;
  const shouldShowPrimeTokensLeftIndicator = primeTokensLeft > 0 && primeTokensLeft <= last5Percent;

  const handleClaimPrimeToken = async () => {
    try {
      await onClaimPrimeToken();
    } catch (error) {
      handleError({ error });
    }
  };

  const stakeDeltaTokens = minXvsToStakeForPrimeTokens.minus(userStakedXvsTokens);
  const isUserXvsStakeHighEnoughForPrime = !!stakeDeltaTokens?.isLessThanOrEqualTo(0);

  const readableStakeDeltaTokens = formatTokensToReadableValue({
    value: stakeDeltaTokens,
    token: xvs,
  });

  const readableApyBoostPercentage = formatPercentageToReadableValue(
    highestPrimeSimulationApyBoostPercentage,
  );

  const readableClaimWaitingPeriod = formatWaitingPeriod({
    waitingPeriodSeconds: primeClaimWaitingPeriodSeconds,
  });

  const readableUserClaimWaitingPeriod = formatWaitingPeriod({
    waitingPeriodSeconds: userPrimeClaimWaitingPeriodSeconds,
  });

  const readableMinXvsToStakeForPrimeTokens = formatTokensToReadableValue({
    value: minXvsToStakeForPrimeTokens,
    token: xvs,
  });

  const readableUserStakedXvsTokens = formatTokensToReadableValue({
    value: userStakedXvsTokens,
    token: xvs,
  });

  const title = useMemo(() => {
    if (isUserXvsStakeHighEnoughForPrime && userPrimeClaimWaitingPeriodSeconds > 0) {
      return t('primeStatusBanner.waitForPrimeTitle', {
        claimWaitingPeriod: readableUserClaimWaitingPeriod,
      });
    }

    if (isUserXvsStakeHighEnoughForPrime && userPrimeClaimWaitingPeriodSeconds === 0) {
      return t('primeStatusBanner.becomePrimeTitle');
    }

    if (readableApyBoostPercentage && !hidePromotionalTitle) {
      return (
        <Trans
          i18nKey="primeStatusBanner.promotionalTitle"
          components={{
            GreenText: <span className="text-green" />,
          }}
          values={{
            percentage: readableApyBoostPercentage,
          }}
        />
      );
    }
  }, [
    hidePromotionalTitle,
    readableApyBoostPercentage,
    userPrimeClaimWaitingPeriodSeconds,
    readableUserClaimWaitingPeriod,
    isUserXvsStakeHighEnoughForPrime,
    Trans,
    t,
  ]);

  const isPrimeCalculatorEnabled = useIsFeatureEnabled({
    name: 'primeCalculator',
  });

  const displayProgress = !isUserXvsStakeHighEnoughForPrime;
  const displayWarning = haveAllPrimeTokensBeenClaimed && primeTokenLimit > 0;

  const displayStakeButton =
    !haveAllPrimeTokensBeenClaimed && !hidePromotionalTitle && !isUserXvsStakeHighEnoughForPrime;
  const displayClaimButton =
    !haveAllPrimeTokensBeenClaimed &&
    isUserXvsStakeHighEnoughForPrime &&
    userPrimeClaimWaitingPeriodSeconds <= 0;

  return (
    <Card
      data-testid={TEST_IDS.primeStatusBannerContainer}
      className={cn(
        'relative flex flex-col content-center md:flex-row md:justify-between',
        isUserXvsStakeHighEnoughForPrime && 'items-start md:items-center',
        shouldShowPrimeTokensLeftIndicator && 'mt-3',
        className,
      )}
    >
      <div
        className={cn(
          'w-full flex-col md:w-auto md:flex-1',
          !hidePromotionalTitle && displayProgress && !displayWarning && 'mb-6',
          (displayStakeButton || displayClaimButton) && 'mb-4 md:mb-0 md:pr-6',
          displayWarning && !displayProgress && 'md:flex md:justify-between',
          displayWarning && 'order-2 md:order-1 md:flex-1 md:pr-6',
        )}
      >
        {shouldShowPrimeTokensLeftIndicator && (
          <div
            data-testid={TEST_IDS.primeTokensLeftWarning}
            className={cn(
              !hidePromotionalTitle &&
                'sm:left-18 absolute right-4 top-0 -mt-3 sm:right-auto md:left-20',
              hidePromotionalTitle && 'mb-4 inline-block',
            )}
          >
            <PrimeTokensLeft count={primeTokensLeft} />
          </div>
        )}
        {displayWarning && hidePromotionalTitle && (
          <div
            className={cn(
              'mb-4 flex items-center text-right sm:flex',
              displayProgress && 'md:mb-4',
            )}
          >
            <NoPrimeTokensLeftWarning primeTokenLimit={primeTokenLimit} />
          </div>
        )}

        <div
          className={cn(
            'flex flex-col sm:flex-row',
            displayProgress && 'mb-6',
            (!title || !displayProgress) && 'sm:items-center',
          )}
        >
          <div className="mb-4 inline-flex w-10 sm:mb-0 sm:mr-4">
            <PrimeLogo />
          </div>

          <div className="2xl:max-w-[39.75rem] xl:max-w-[31.25rem]">
            {!!title && <h3 className={cn('text-lg', displayProgress && 'mb-2')}>{title}</h3>}

            {displayProgress && (
              <p className="text-grey">
                {isPrimeCalculatorEnabled ? (
                  <Trans
                    i18nKey="primeStatusBanner.description.primeCalculator"
                    components={{
                      WhiteText: <span className="text-white" />,
                      Link: <Link to={routes.primeCalculator.path} />,
                    }}
                    values={{
                      stakeDelta: readableStakeDeltaTokens,
                      claimWaitingPeriod: readableClaimWaitingPeriod,
                    }}
                  />
                ) : (
                  <Trans
                    i18nKey="primeStatusBanner.description.primeDoc"
                    components={{
                      WhiteText: <span className="text-white" />,
                      Link: <Link href={PRIME_DOC_URL} />,
                    }}
                    values={{
                      stakeDelta: readableStakeDeltaTokens,
                      claimWaitingPeriod: readableClaimWaitingPeriod,
                    }}
                  />
                )}
              </p>
            )}
          </div>
        </div>

        {displayProgress && (
          <div className={cn('xl:max-w-[31.25rem]', !!title && 'sm:pl-14')}>
            <ProgressBar
              className="mb-2"
              value={+userStakedXvsTokens.toFixed(0)}
              step={1}
              ariaLabel={t('primeStatusBanner.progressBar.ariaLabel')}
              min={0}
              max={+minXvsToStakeForPrimeTokens.toFixed(0)}
            />

            <p className="text-grey text-sm">
              <Trans
                i18nKey="primeStatusBanner.progressBar.label"
                components={{
                  WhiteText: <span className="text-white" />,
                }}
                values={{
                  minXvsToStakeForPrimeTokens: readableMinXvsToStakeForPrimeTokens,
                  userStakedXvsTokens: readableUserStakedXvsTokens,
                }}
              />
            </p>
          </div>
        )}
      </div>

      {(displayStakeButton || displayClaimButton || displayWarning) && (
        <div
          className={cn(
            'md:flex-0 w-full md:w-auto',
            !haveAllPrimeTokensBeenClaimed && !!title && 'sm:pl-14 md:pl-0',
            displayWarning && 'order-1 md:order-2',
          )}
        >
          {displayWarning && !hidePromotionalTitle && (
            <div
              className={cn(
                'mb-4 hidden items-center text-right sm:flex md:mb-0',
                displayProgress && 'md:mb-4 md:pt-1',
              )}
            >
              <NoPrimeTokensLeftWarning primeTokenLimit={primeTokenLimit} />
            </div>
          )}

          {displayStakeButton && (
            <PrimaryButton
              data-testid={TEST_IDS.stakeXvsButton}
              onClick={onRedirectToXvsVaultPage}
              className="w-full whitespace-nowrap sm:w-auto"
            >
              {t('primeStatusBanner.stakeButtonLabel')}
            </PrimaryButton>
          )}

          {displayClaimButton && (
            <PrimaryButton
              data-testid={TEST_IDS.claimPrimeTokenButton}
              onClick={handleClaimPrimeToken}
              className="w-full whitespace-nowrap sm:w-auto"
              loading={isClaimPrimeTokenLoading}
            >
              {t('primeStatusBanner.claimButtonLabel')}
            </PrimaryButton>
          )}
        </div>
      )}
    </Card>
  );
};

export type PrimeStatusBannerProps = Pick<
  PrimeStatusBannerUiProps,
  'className' | 'hidePromotionalTitle'
>;

const PrimeStatusBanner: React.FC<PrimeStatusBannerProps> = props => {
  const { accountAddress } = useAccountAddress();
  const { navigate } = useNavigate();
  const redirectToXvsPage = () => navigate(routes.staking.path);

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const {
    data: {
      isUserPrime,
      claimedPrimeTokenCount,
      primeTokenLimit,
      claimWaitingPeriodSeconds,
      userClaimTimeRemainingSeconds,
      userStakedXvsTokens,
      minXvsToStakeForPrimeTokens,
      userHighestPrimeSimulationApyBoostPercentage,
    },
    isLoading,
  } = useGetUserPrimeInfo({ accountAddress });

  const { mutateAsync: claimPrimeToken, isPending: isClaimPrimeTokenLoading } = useClaimPrimeToken({
    waitForConfirmation: true,
  });

  // Hide component while loading or if user is Prime already
  if (
    isUserPrime ||
    isLoading ||
    !xvs ||
    typeof claimedPrimeTokenCount !== 'number' ||
    typeof primeTokenLimit !== 'number' ||
    typeof claimWaitingPeriodSeconds !== 'number' ||
    typeof userClaimTimeRemainingSeconds !== 'number' ||
    !userStakedXvsTokens ||
    !minXvsToStakeForPrimeTokens ||
    !userHighestPrimeSimulationApyBoostPercentage
  ) {
    return undefined;
  }

  return (
    <PrimeStatusBannerUi
      xvs={xvs}
      claimedPrimeTokenCount={claimedPrimeTokenCount}
      primeTokenLimit={primeTokenLimit}
      primeClaimWaitingPeriodSeconds={claimWaitingPeriodSeconds}
      userPrimeClaimWaitingPeriodSeconds={userClaimTimeRemainingSeconds}
      userStakedXvsTokens={userStakedXvsTokens}
      onRedirectToXvsVaultPage={redirectToXvsPage}
      onClaimPrimeToken={claimPrimeToken}
      minXvsToStakeForPrimeTokens={minXvsToStakeForPrimeTokens}
      highestPrimeSimulationApyBoostPercentage={userHighestPrimeSimulationApyBoostPercentage}
      isClaimPrimeTokenLoading={isClaimPrimeTokenLoading}
      hidePromotionalTitle={!userHighestPrimeSimulationApyBoostPercentage}
      {...props}
    />
  );
};

export default PrimeStatusBanner;

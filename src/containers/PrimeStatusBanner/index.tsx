import BigNumber from 'bignumber.js';
import { Card, Link, PrimaryButton, ProgressBar } from 'components';
import { displayMutationError } from 'errors';
import { useGetToken } from 'packages/tokens';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'translation';
import { AssetDistribution, Token } from 'types';
import { cn, convertWeiToTokens, generatePseudoRandomRefetchInterval } from 'utilities';

import { ReactComponent as PrimeLogo } from 'assets/img/primeLogo.svg';
import {
  useClaimPrimeToken,
  useGetMainPool,
  useGetPrimeStatus,
  useGetPrimeToken,
  useGetXvsVaultUserInfo,
} from 'clients/api';
import { PRIME_DOC_URL } from 'constants/prime';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useConvertWeiToReadableTokenString from 'hooks/useFormatTokensToReadableValue';

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
  highestPrimeSimulationApyBoostPercentage: BigNumber;
  primeClaimWaitingPeriodSeconds: number;
  userPrimeClaimWaitingPeriodSeconds: number;
  hidePromotionalTitle?: boolean;
  className?: string;
}

const refetchInterval = generatePseudoRandomRefetchInterval();

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
  const shouldShowPrimeTokensLeftIndicator = primeTokensLeft > 0 && primeTokensLeft <= last5Percent;

  const handleClaimPrimeToken = async () => {
    try {
      await onClaimPrimeToken();
    } catch (error) {
      displayMutationError({ error });
    }
  };

  const stakeDeltaTokens = useMemo(
    () => minXvsToStakeForPrimeTokens.minus(userStakedXvsTokens),
    [minXvsToStakeForPrimeTokens, userStakedXvsTokens],
  );
  const isUserXvsStakeHighEnoughForPrime = !!stakeDeltaTokens?.isLessThanOrEqualTo(0);

  const haveAllPrimeTokensBeenClaimed = useMemo(
    () => claimedPrimeTokenCount >= primeTokenLimit,
    [primeTokenLimit, claimedPrimeTokenCount],
  );

  const readableStakeDeltaTokens = useConvertWeiToReadableTokenString({
    value: stakeDeltaTokens,
    token: xvs,
    roundingMode: BigNumber.ROUND_UP,
  });

  const readableApyBoostPercentage = useFormatPercentageToReadableValue({
    value: highestPrimeSimulationApyBoostPercentage,
  });

  const [readableClaimWaitingPeriod, readableUserClaimWaitingPeriod] = useMemo(
    () => [
      formatWaitingPeriod({ waitingPeriodSeconds: primeClaimWaitingPeriodSeconds }),
      formatWaitingPeriod({ waitingPeriodSeconds: userPrimeClaimWaitingPeriodSeconds }),
    ],
    [primeClaimWaitingPeriodSeconds, userPrimeClaimWaitingPeriodSeconds],
  );

  const readableMinXvsToStakeForPrimeTokens = useConvertWeiToReadableTokenString({
    value: minXvsToStakeForPrimeTokens,
    token: xvs,
  });

  const readableUserStakedXvsTokens = useConvertWeiToReadableTokenString({
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

    if (!hidePromotionalTitle) {
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

  const displayProgress = !isUserXvsStakeHighEnoughForPrime;
  const displayWarning = haveAllPrimeTokensBeenClaimed;
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
                'absolute right-4 top-0 -mt-3 sm:left-18 sm:right-auto md:left-20',
              hidePromotionalTitle && 'mb-4 inline-block',
            )}
          >
            <PrimeTokensLeft tokensLeft={primeTokensLeft} />
          </div>
        )}
        {displayWarning && (
          <div
            className={cn(
              'mb-4 flex items-center text-right sm:hidden',
              hidePromotionalTitle && 'sm:flex',
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

          <div className="xl:max-w-[31.25rem] xxl:max-w-[39.75rem]">
            {!!title && <h3 className={cn('text-xl', displayProgress && 'mb-2')}>{title}</h3>}

            {displayProgress && (
              <p className="text-grey">
                <Trans
                  i18nKey="primeStatusBanner.description"
                  components={{
                    WhiteText: <span className="text-offWhite" />,
                    Link: <Link href={PRIME_DOC_URL} />,
                  }}
                  values={{
                    stakeDelta: readableStakeDeltaTokens,
                    claimWaitingPeriod: readableClaimWaitingPeriod,
                  }}
                />
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

            <p className="text-sm text-grey">
              <Trans
                i18nKey="primeStatusBanner.progressBar.label"
                components={{
                  WhiteText: <span className="text-offWhite" />,
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
  const navigate = useNavigate();
  const redirectToXvsPage = () => navigate(routes.vaults.path);

  const { accountAddress } = useAuth();
  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } = useGetPrimeToken({
    accountAddress,
  });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { data: primeStatusData, isLoading: isLoadingPrimeStatus } = useGetPrimeStatus(
    {
      accountAddress,
    },
    {
      enabled: !isGetPrimeTokenLoading && !isAccountPrime,
      refetchInterval,
    },
  );

  const { data: getMainPoolData, isLoading: isGetMainPoolDataLoading } = useGetMainPool({
    accountAddress,
  });

  const primeAssets = getMainPoolData?.pool.assets.filter(
    a => primeStatusData?.primeMarkets.includes(a.vToken.address),
  );
  const primeApySimulations = primeAssets?.reduce<AssetDistribution[]>(
    (acc, a) =>
      acc.concat(
        a.supplyDistributions
          .concat(a.borrowDistributions)
          .filter(d => d.type === 'primeSimulation'),
      ),
    [],
  );
  const primeOrderedApys = primeApySimulations
    ?.reduce<BigNumber[]>((acc, s) => acc.concat(s.apyPercentage), [])
    .sort((a, b) => b.minus(a).toNumber());

  const { data: userStakedXvsTokensData, isLoading: isLoadingXvsVaultUserInfo } =
    useGetXvsVaultUserInfo(
      {
        accountAddress: accountAddress || '',
        poolIndex: primeStatusData?.xvsVaultPoolId || 0,
        rewardTokenAddress: primeStatusData?.rewardTokenAddress || '',
      },
      {
        enabled: !!accountAddress && !!primeStatusData,
      },
    );

  const userNonPendingStakedXvsMantissa = userStakedXvsTokensData?.stakedAmountWei.minus(
    userStakedXvsTokensData.pendingWithdrawalsTotalAmountWei,
  );

  const { mutateAsync: claimPrimeToken, isLoading: isClaimPrimeTokenLoading } =
    useClaimPrimeToken();

  const isLoading =
    isGetPrimeTokenLoading ||
    isLoadingPrimeStatus ||
    isLoadingXvsVaultUserInfo ||
    isGetMainPoolDataLoading;

  // Hide component while loading or if user is Prime already
  if (isAccountPrime || isLoading || !primeStatusData || !primeOrderedApys) {
    return null;
  }

  const {
    primeTokenLimit,
    primeMinimumStakedXvsMantissa,
    claimWaitingPeriodSeconds,
    claimedPrimeTokenCount,
    userClaimTimeRemainingSeconds,
  } = primeStatusData;

  const userStakedXvsTokens = convertWeiToTokens({
    valueWei: userNonPendingStakedXvsMantissa || new BigNumber('0'),
    token: xvs,
  });

  const minXvsToStakeForPrimeTokens = convertWeiToTokens({
    valueWei: primeMinimumStakedXvsMantissa || new BigNumber('0'),
    token: xvs,
  });

  const highestPrimeSimulationApyBoostPercentage = primeOrderedApys[0];

  return (
    <PrimeStatusBannerUi
      xvs={xvs!}
      claimedPrimeTokenCount={claimedPrimeTokenCount}
      primeTokenLimit={primeTokenLimit}
      primeClaimWaitingPeriodSeconds={claimWaitingPeriodSeconds}
      userPrimeClaimWaitingPeriodSeconds={userClaimTimeRemainingSeconds}
      userStakedXvsTokens={userStakedXvsTokens}
      onRedirectToXvsVaultPage={redirectToXvsPage}
      onClaimPrimeToken={claimPrimeToken}
      minXvsToStakeForPrimeTokens={minXvsToStakeForPrimeTokens}
      highestPrimeSimulationApyBoostPercentage={highestPrimeSimulationApyBoostPercentage}
      isClaimPrimeTokenLoading={isClaimPrimeTokenLoading}
      {...props}
    />
  );
};

export default PrimeStatusBanner;

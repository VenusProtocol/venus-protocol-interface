import BigNumber from 'bignumber.js';
import { Card, Icon, Link, PrimaryButton, ProgressBar, Tooltip } from 'components';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { ContractReceipt } from 'ethers';
import { useGetToken } from 'packages/tokens';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { cn } from 'utilities';

import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { ReactComponent as PrimeLogo } from 'assets/img/primeLogo.svg';
import { PRIME_DOC_URL } from 'constants/prime';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';
import useFormatPercentageToReadableValue from 'hooks/useFormatPercentageToReadableValue';
import useConvertWeiToReadableTokenString from 'hooks/useFormatTokensToReadableValue';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import PrimeTokensLeft from './PrimeTokensLeft';

export interface PrimeStatusBannerUiProps {
  xvs: Token;
  claimedPrimeTokenCount: number;
  primeTokenLimit: number;
  isClaimPrimeTokenLoading: boolean;
  onClaimPrimeToken: () => Promise<ContractReceipt>;
  onRedirectToXvsVaultPage: () => void;
  userStakedXvsTokens: BigNumber;
  minXvsToStakeForPrimeTokens: BigNumber;
  highestPrimeSimulationApyBoostPercentage: BigNumber;
  primeClaimWaitingPeriodSeconds: number;
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
  minXvsToStakeForPrimeTokens,
  userStakedXvsTokens,
  hidePromotionalTitle = false,
  onClaimPrimeToken,
  onRedirectToXvsVaultPage,
}) => {
  const { Trans, t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();
  const last5Percent = primeTokenLimit * 0.05;
  const primeTokensLeft = primeTokenLimit - claimedPrimeTokenCount;
  const shouldShowPrimeTokensLeftIndicator = primeTokensLeft > 0 && primeTokensLeft <= last5Percent;

  const handleClaimPrimeToken = () =>
    handleTransactionMutation({
      mutate: onClaimPrimeToken,
      successTransactionModalProps: contractReceipt => ({
        title: t('primeStatusBanner.successfulTransactionModal.title'),
        content: t('primeStatusBanner.successfulTransactionModal.message'),
        transactionHash: contractReceipt.transactionHash,
      }),
    });

  const stakeDeltaTokens = useMemo(
    () => minXvsToStakeForPrimeTokens.minus(userStakedXvsTokens),
    [minXvsToStakeForPrimeTokens, userStakedXvsTokens],
  );
  const isUserXvsStakeHighEnoughForPrime = !!stakeDeltaTokens?.isEqualTo(0);

  const haveAllPrimeTokensBeenClaimed = useMemo(
    () => claimedPrimeTokenCount >= primeTokenLimit,
    [primeTokenLimit, claimedPrimeTokenCount],
  );

  const readableStakeDeltaTokens = useConvertWeiToReadableTokenString({
    value: stakeDeltaTokens,
    token: xvs,
  });

  const readableApyBoostPercentage = useFormatPercentageToReadableValue({
    value: highestPrimeSimulationApyBoostPercentage,
  });

  const readableClaimWaitingPeriod = useMemo(
    () =>
      formatDistanceStrict(
        new Date(),
        new Date().getTime() + primeClaimWaitingPeriodSeconds * 1000,
      ),
    [primeClaimWaitingPeriodSeconds],
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
    if (isUserXvsStakeHighEnoughForPrime && primeClaimWaitingPeriodSeconds > 0) {
      return t('primeStatusBanner.waitForPrimeTitle', {
        claimWaitingPeriod: readableClaimWaitingPeriod,
      });
    }

    if (isUserXvsStakeHighEnoughForPrime && primeClaimWaitingPeriodSeconds === 0) {
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
  }, [hidePromotionalTitle, readableApyBoostPercentage, isUserXvsStakeHighEnoughForPrime]);

  const displayProgress = !isUserXvsStakeHighEnoughForPrime;
  const displayWarning = haveAllPrimeTokensBeenClaimed;
  const displayStakeButton =
    !haveAllPrimeTokensBeenClaimed && !hidePromotionalTitle && !isUserXvsStakeHighEnoughForPrime;
  const displayClaimButton =
    !haveAllPrimeTokensBeenClaimed &&
    isUserXvsStakeHighEnoughForPrime &&
    primeClaimWaitingPeriodSeconds <= 0;

  return (
    <Card
      className={cn(
        'relative flex flex-col content-center md:flex-row md:justify-between',
        isUserXvsStakeHighEnoughForPrime && 'items-start md:items-center',
        shouldShowPrimeTokensLeftIndicator && 'mt-3',
        className,
      )}
    >
      {shouldShowPrimeTokensLeftIndicator && (
        <div className="absolute top-0 -mt-3 right-4 sm:right-auto sm:left-18 md:left-20">
          <PrimeTokensLeft tokensLeft={primeTokensLeft} />
        </div>
      )}

      <div
        className={cn(
          'w-full md:w-auto md:flex-1',
          !hidePromotionalTitle && displayProgress && !displayWarning && 'mb-6',
          (displayStakeButton || displayClaimButton) && 'mb-4 md:mb-0 md:pr-6',
          displayWarning && !displayProgress && 'md:flex md:flex-row md:justify-between',
          displayWarning && 'order-2 md:order-1 md:flex-1 md:pr-6',
        )}
      >
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
          {displayWarning && (
            <div
              className={cn(
                'mb-4 flex items-center text-right md:mb-0',
                displayProgress && 'md:mb-4',
              )}
            >
              <p className="mr-2 text-sm text-orange">
                {t('primeStatusBanner.noPrimeTokenWarning.text')}
              </p>

              <Tooltip
                title={t('primeStatusBanner.noPrimeTokenWarning.tooltip', { primeTokenLimit })}
                className="inline-flex"
              >
                <Icon name="info" className="text-orange" />
              </Tooltip>
            </div>
          )}

          {displayStakeButton && (
            <PrimaryButton
              onClick={onRedirectToXvsVaultPage}
              className="w-full whitespace-nowrap sm:w-auto"
            >
              {t('primeStatusBanner.stakeButtonLabel')}
            </PrimaryButton>
          )}

          {displayClaimButton && (
            <PrimaryButton
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
  const { isPrime } = useAuth();
  const redirectToXvsPage = () => navigate(routes.vaults.path);

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  // TODO: wire up
  const isLoading = false;
  const primeClaimWaitingPeriodSeconds = 90 * 24 * 60 * 60; // 90 days in seconds
  const userStakedXvsTokens = new BigNumber('100');
  const minXvsToStakeForPrimeTokens = new BigNumber('1000');
  const highestPrimeSimulationApyBoostPercentage = new BigNumber('3.14');
  const claimedPrimeTokenCount = 975;
  const primeTokenLimit = 1000;

  const claimPrimeToken = async () => fakeContractReceipt;
  const isClaimPrimeTokenLoading = false;

  // Hide component while loading or if user is Prime already
  if (isLoading || isPrime) {
    return null;
  }

  return (
    <PrimeStatusBannerUi
      xvs={xvs!}
      claimedPrimeTokenCount={claimedPrimeTokenCount}
      primeTokenLimit={primeTokenLimit}
      primeClaimWaitingPeriodSeconds={primeClaimWaitingPeriodSeconds}
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

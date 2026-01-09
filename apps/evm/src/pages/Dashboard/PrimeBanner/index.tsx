import { cn } from '@venusprotocol/ui';
import primeLogoSrc from 'assets/img/primeLogo.svg';
import { useClaimPrimeToken } from 'clients/api';
import { Button, ButtonWrapper, Card, Icon } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { handleError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { MouseEventHandler } from 'react';
import { formatPercentageToReadableValue } from 'utilities';
import { store } from './store';
import { testIds } from './testIds';

export interface PrimeBannerProps {
  canUserBecomePrime: boolean;
  boostPercentage: BigNumber;
  className?: string;
}

export const PrimeBanner: React.FC<PrimeBannerProps> = ({
  canUserBecomePrime,
  boostPercentage,
  className,
  ...otherProps
}) => {
  const { t, Trans } = useTranslation();

  const doNotShowPrimePromotionalBanner = store.use.doNotShowPrimePromotionalBanner();
  const hidePrimePromotionalBanner = store.use.hidePrimePromotionalBanner();

  const onHidePrimePromotionalBanner: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    hidePrimePromotionalBanner();
  };

  const { mutateAsync: claimPrimeToken, isPending: isClaimPrimeTokenLoading } = useClaimPrimeToken({
    onError: error => handleError({ error }),
    waitForConfirmation: true,
  });

  const readableBoost = formatPercentageToReadableValue(boostPercentage);

  const buttonContentDom = (
    <>
      <span className="hidden sm:block">
        {canUserBecomePrime
          ? t('account.primeBanner.button.becomePrime')
          : t('account.primeBanner.button.stakeXvs')}
      </span>

      <Icon className="text-white w-6 h-6 sm:hidden" name="chevronRight" />
    </>
  );

  const buttonClasses = cn('text-white hover:no-underline shrink-0 w-8 p-0 sm:w-auto sm:px-5');

  // Hide banner if user previously closed it and they can't become Prime yet
  if (!canUserBecomePrime && doNotShowPrimePromotionalBanner) {
    return undefined;
  }

  const dom = (
    <div
      className={cn('relative block text-inherit hover:no-underline overflow-visible', className)}
      {...otherProps}
    >
      {canUserBecomePrime && (
        <div className="absolute inset-0 opacity-80 bg-linear-to-r from-[#FF8461] via-[rgba(249,196,60,0.4)] to-[#00A7FF] blur-md filter" />
      )}

      <Card
        className={cn(
          'relative flex justify-center items-center py-2 rounded-lg',
          canUserBecomePrime ? 'h-12' : 'h-auto sm:h-12',
        )}
      >
        <div className="flex grow justify-center items-center">
          <img
            src={primeLogoSrc}
            alt={t('account.primeBanner.primeLogoAltText')}
            className="shrink-0 w-6 h-6 mr-3"
          />

          <p className="mr-4 text-sm">
            {canUserBecomePrime ? (
              t('account.primeBanner.text.becomePrime')
            ) : (
              <Trans
                i18nKey="account.primeBanner.text.apyBoost"
                components={{
                  GreenText: <span className="text-green" />,
                }}
                values={{
                  boost: readableBoost,
                }}
              />
            )}
          </p>

          {canUserBecomePrime ? (
            <Button
              onClick={() => claimPrimeToken()}
              loading={isClaimPrimeTokenLoading}
              small
              className={buttonClasses}
            >
              {buttonContentDom}
            </Button>
          ) : (
            <ButtonWrapper asChild small className={cn('hidden sm:flex', buttonClasses)}>
              <Link to={routes.staking.path}>{buttonContentDom}</Link>
            </ButtonWrapper>
          )}
        </div>

        {!canUserBecomePrime && (
          <button
            type="button"
            onClick={onHidePrimePromotionalBanner}
            data-testid={testIds.closeButton}
            className="cursor-pointer"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        )}
      </Card>
    </div>
  );

  return (
    <div {...otherProps}>
      {/* XS view */}
      <div className="sm:hidden">
        {canUserBecomePrime ? (
          <button onClick={() => claimPrimeToken()} type="button" className="w-full cursor-pointer">
            {dom}
          </button>
        ) : (
          <Link className="text-inherit block hover:no-underline" to={routes.staking.path}>
            {dom}
          </Link>
        )}
      </div>

      {/* SM and up view */}
      <div className="hidden sm:block">{dom}</div>
    </div>
  );
};

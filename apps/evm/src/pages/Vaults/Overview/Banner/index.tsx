import { cn } from '@venusprotocol/ui';
import { useVaultUsdValues } from 'containers/Vault/hooks/useVaultUsdValues';
import { useTranslation } from 'libs/translations';
import type { AnyVault } from 'types';
import {
  convertMantissaToTokens,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';
import bannerCoinSrc from './asset/banner-coins-xvs.png';
import bannerVaultSrc from './asset/banner-vault.png';

export interface BannerProps {
  vault: AnyVault;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ vault, className }) => {
  const { t, Trans } = useTranslation();

  const { stakingAprPercentage, stakedToken, totalStakedMantissa } = vault;
  const {
    data: { totalStakedUsdCents },
  } = useVaultUsdValues(vault);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-[linear-gradient(90deg,#0829AE_0%,#0254EB_100%)]',
        'flex items-center md:items-start p-3 md:py-3 md:px-6 lg:p-6',
        // height per breakpoint
        'h-17.5 sm:h-19.5 md:h-27.5 lg:h-47',
        // width: full at mobile/sm/md, fixed at lg+
        'lg:shrink-0 lg:w-106 xl:w-132.5 2xl:w-156.5',
        className,
      )}
    >
      {/* Vault Illustration */}
      <img
        className={cn(
          'hidden absolute bottom-0 pointer-events-none',
          '-right-[2%] bottom-9.5 h-24',
          'sm:-right-8 sm:bottom-0 sm:h-32',
          'md:right-0 md:h-32',
          'lg:-right-6 lg:h-30',
          'xl:block xl:-bottom-2 xl:-right-7 xl:h-44',
          '2xl:right-2 2xl:h-48',
        )}
        aria-hidden
        src={bannerVaultSrc}
        alt={t('vault.overview.bannerVaultIllustration')}
      />

      {/* Coin Illustration */}
      <img
        className={cn(
          'absolute bottom-0 pointer-events-none',
          '-right-[3%] -bottom-5 h-15',
          'sm:right-4 sm:-bottom-8 sm:h-28',
          'md:right-4 md:-bottom-11 md:h-38',
          'lg:-right-6 lg:-bottom-9 lg:h-38',
          'xl:block xl:left-3 xl:-bottom-12 xl:h-35',
          '2xl:left-4 2xl:-bottom-12 2xl:h-36',
        )}
        aria-hidden
        src={bannerCoinSrc}
        alt={t('vault.overview.bannerCoinIllustration', { token: 'XVS' })}
      />

      {/* Content */}
      <div
        className={cn(
          'relative z-10 flex flex-col gap-2 sm:my-3 lg:my-0 w-full sm:w-fit lg:max-xl:mt-3',
        )}
      >
        {/* Title */}
        <p className="text-b1s md:text-p3s text-grey">
          <Trans
            i18nKey="vault.overview.bannerTitle"
            components={{
              strong: <strong className="text-light-grey-active font-semibold" />,
            }}
            values={{
              apyPercentage: formatPercentageToReadableValue(stakingAprPercentage),
              tokenDashMarket: `${stakedToken.symbol} `,
            }}
          />
        </p>

        {/* Stats + CTA: row on sm/md, column on lg+ */}
        <div className="flex sm:flex-row items-end justify-between lg:flex-col lg:items-start lg:justify-between gap-3 lg:gap-12">
          <div className="flex flex-col gap-1">
            <div className="flex lg:max-xl:block items-center gap-1 sm:gap-2 flex-wrap">
              <span className="text-b2r sm:text-b1r md:text-p3r text-grey">
                {t('vault.overview.tokenTotalDeposited', { token: stakedToken.symbol })}
              </span>
              <div className="flex items-center lg:max-xl:mt-1 gap-1 sm:gap-2">
                <img src={stakedToken.iconSrc} alt={stakedToken.symbol} className="h-4 md:h-5" />
                <span className="text-b2s sm:text-b1s md:text-p3s">
                  {convertMantissaToTokens({
                    value: totalStakedMantissa,
                    token: stakedToken,
                    returnInReadableFormat: true,
                  })}{' '}
                  {`(${formatCentsToReadableValue({ value: totalStakedUsdCents })})`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

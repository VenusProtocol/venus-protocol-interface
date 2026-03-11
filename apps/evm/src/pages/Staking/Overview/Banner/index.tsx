import { PrimaryButton, cn } from '@venusprotocol/ui';
import type { ActiveModal } from 'containers/Vault';
import { useVaultUsdValues } from 'containers/Vault/hooks/useVaultUsdValues';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';
import bannerVaultSrc from './asset/banner-vault.png';

export interface BannerProps {
  vault: Vault;
  onOpenModal?: (vault: Vault, activeModal: ActiveModal) => void;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ vault, onOpenModal, className }) => {
  const { t, Trans } = useTranslation();

  const { stakingAprPercentage, stakedToken } = vault;
  const {
    data: { totalStakedUsdCents },
  } = useVaultUsdValues(vault);

  const onEarnClick = () => {
    onOpenModal?.(vault, 'stake');
  };

  return (
    <div
      className={cn(
        'relative overflow-visible sm:overflow-hidden rounded-lg bg-[linear-gradient(90deg,#0829AE_0%,#0254EB_100%)]',
        'flex items-center p-3 md:py-3 md:px-6 lg:p-6',
        // height per breakpoint

        // width: full at mobile/sm/md, fixed at lg+
        'lg:shrink-0 lg:w-106 xl:w-132.5 2xl:w-156.5',
        className,
      )}
    >
      {/* Illustration */}
      <img
        className={cn(
          'absolute bottom-0 pointer-events-none',
          '-right-[2%] bottom-9.5 h-24',
          'sm:-right-8 sm:bottom-0 sm:h-32',
          'md:right-0 md:h-32',
          'lg:-right-6 lg:h-30',
          'xl:-right-7 xl:h-37',
          '2xl:right-4 2xl:h-38',
        )}
        aria-hidden
        src={bannerVaultSrc}
        alt="vault.overview.bannerIllustration"
      />

      {/* Content */}
      <div className={cn('relative z-10 flex flex-col gap-2 sm:my-3 lg:my-0 w-full sm:w-fit')}>
        {/* Title */}
        <p className="text-b1s md:text-p3s text-grey max-sm:max-w-1/2">
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
            {/* <div className="flex items-center gap-1">
              <span className="text-b1r text-grey">{t('vault.overview.dailyEmission')}</span>
              <span className="text-b1s">
                {formatCentsToReadableValue({ value: dailyEmissionUsdCents })}
              </span>
            </div> */}

            <div className="flex items-center gap-1">
              <span className="text-b1r text-grey">
                {t('vault.overview.tokenTotalDeposited', { token: stakedToken.symbol })}
              </span>
              <span className="text-b1s">
                {formatCentsToReadableValue({ value: totalStakedUsdCents })}
              </span>
            </div>
          </div>

          <PrimaryButton
            onClick={onEarnClick}
            className="h-7.5 py-1 px-5 text-b1s rounded-lg max-sm:px-4 max-sm:mr-1"
            size="xs"
          >
            {t('vault.overview.earningNow')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
